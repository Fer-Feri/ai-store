import { Product } from "@/types";
import { NextRequest, NextResponse } from "next/server";

const EXCHANGE_RATE = 180_000;
// *۱ ===> دسته‌بندی‌های مجاز (همان‌هایی که fakestoreapi دارد)
const ALLOWED_CATEGORIES = [
  "electronics",
  "jewelery",
  "men's clothing",
  "women's clothing",
] as const;

type Category = (typeof ALLOWED_CATEGORIES)[number];

// *۲ ===> خروجی استانداردی که از AI می‌خواهیم
type SearchIntent = {
  category: Category | null;
  keyword: string | null;
  maxPrice: number | null;
};

// *2 ===> تبدیل اعداد فارسی به انگلیسی
const toEnglishDigits = (input: string): string => {
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  const arabicDigits = "٠١٢٣٤٥٦٧٨٩";

  return input
    .split("")
    .map((char) => {
      const persianIndex = persianDigits.indexOf(char);
      if (persianIndex !== -1) return String(persianIndex);

      const arabicIndex = arabicDigits.indexOf(char);
      if (arabicIndex !== -1) return String(arabicIndex);

      return char;
    })
    .join("");
};

// *=================================================================
const parseMaxPrice = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value > 0 ? value : null;
  }

  if (typeof value === "string") {
    const normalized = toEnglishDigits(value).replace(/[^\d.]/g, "");

    const parsed = Number(normalized);

    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }

  return null;
};

// *۳ ===> نگهبان خروجی AI - فقط مقادیر مجاز را نگه می‌دارد
const clampIntent = (raw: unknown): SearchIntent => {
  const data =
    typeof raw === "object" && raw !== null
      ? (raw as Record<string, unknown>)
      : {};

  const category = ALLOWED_CATEGORIES.includes(data.category as Category)
    ? (data.category as Category)
    : null;

  const keyword =
    typeof data.keyword === "string" ? data.keyword.trim() || null : null;

  const maxPrice = parseMaxPrice(data.maxPrice);

  return {
    category,
    keyword,
    maxPrice,
  };
};

// *=================================================================
const normalizeSearchText = (value: string): string => {
  return value
    .toLowerCase()
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[-_/]/g, " ")
    .replace(/[.,،؛:!?()[\]{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};
// *=================================================================
// *۵ ===> فیلتر نهایی روی محصولات
const filterProduct = (
  products: Product[],
  intent: SearchIntent,
): Product[] => {
  return products.filter((product) => {
    // فیلتر دسته‌بندی
    if (intent.category && product.category !== intent.category) {
      return false;
    }

    // فیلتر قیمت
    if (intent.maxPrice !== null) {
      const priceInToman = product.price * EXCHANGE_RATE;

      if (priceInToman > intent.maxPrice) {
        return false;
      }
    }

    // فیلتر کلمه کلیدی
    if (intent.keyword) {
      const searchContent = normalizeSearchText(
        `${product.title} ${product.description}`,
      );

      const normalizedKeyword = normalizeSearchText(intent.keyword);

      if (normalizedKeyword && !searchContent.includes(normalizedKeyword)) {
        return false;
      }
    }

    return true;
  });
};

// *۶ ===> ساخت آدرس جستجوی محصول
const buildProductUrl = (intent: SearchIntent): string => {
  if (intent.category) {
    return `https://fakestoreapi.com/products/category/${intent.category}`;
  }
  return "https://fakestoreapi.com/products";
};

// *۷ ===> بدنه اصلی: Route Handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const useQuery = body?.query;

    if (typeof useQuery !== "string" || useQuery.trim() === "") {
      return NextResponse.json(
        { error: "لطفاً یک عبارت جستجو وارد کنید" },
        { status: 400 },
      );
    }
    // محدودیت طول برای جلوگیری از سوءاستفاده/هزینه
    const safeQuery = toEnglishDigits(useQuery).slice(0, 220);

    const aiResponse = await fetch(
      process.env.AI_BASE_URL ??
        "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.AI_API_KEY}`,
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "AI Store",
        },
        body: JSON.stringify({
          model: process.env.AI_MODEL,
          temperature: 0,
          response_format: {
            type: "json_object",
          },
          messages: [
            {
              role: "system",
              content: `تو کمک‌کننده جستجوی محصول هستی.

کاربر فارسی جمله می‌نویسد و تو باید منظور جستجو را به JSON تبدیل کنی.

دسته‌بندی‌های مجاز فقط این‌ها هستند:
${ALLOWED_CATEGORIES.join(", ")}

قوانین:
- اگر کاربر زنانه، خانم، دخترانه یا مشابه آن گفت، دسته‌بندی را "women's clothing" قرار بده.
- اگر کاربر مردانه، آقایان، پسرانه یا مشابه آن گفت، دسته‌بندی را "men's clothing" قرار بده.
- قیمت را به تومان و به صورت عدد برگردان، نه رشته.
- عبارت‌هایی مثل "تیشرت"، "تی‌شرت"، "تی شرت" را به "t shirt" تبدیل کن.
- اگر کلمه کلیدی باعث حذف محصولات مرتبط می‌شود، برای جستجوی کلی آن را null قرار بده.
- فقط JSON معتبر برگردان.

ساختار خروجی دقیقاً:
{
  "category": "یکی از دسته‌بندی‌های مجاز یا null",
  "keyword": "کلمه کلیدی انگلیسی یا null",
  "maxPrice": 5000000
}

اگر سقف قیمت وجود نداشت:
{
  "category": null,
  "keyword": null,
  "maxPrice": null
}`,
            },
            { role: "user", content: safeQuery },
          ],
        }),
      },
    );

    // if (!aiResponse.ok) throw new Error("OpenAI request failed");
    if (!aiResponse.ok) {
      // 🔍 ببین سرویس واقعاً چه می‌گوید
      const errorBody = await aiResponse.text();
      console.error("🔴 AI status:", aiResponse.status);
      console.error("🔴 AI body:", errorBody);
      throw new Error("OpenAI request failed");
    }

    const aiData = await aiResponse.json();

    let parsed: any;

    try {
      parsed = JSON.parse(aiData?.choices?.[0]?.message?.content);
    } catch {
      parsed = {}; //اگر JSON خراب بود، خالی بگذار
    }

    // *۹ ===> عبور از نگهبان
    const intent = clampIntent(parsed);

    console.log("🔎 Search query:", safeQuery);
    console.log("🤖 Raw AI response:", parsed);
    console.log("✅ Clamped intent:", intent);

    // *۱۰ ===> گرفتن محصولات و فیلتر
    const producUrl = buildProductUrl(intent);
    const productResponse = await fetch(producUrl);
    if (!productResponse.ok) throw new Error("Failed to fetch products");

    const products: Product[] = await productResponse.json();
    const results = filterProduct(products, intent).slice(0, 8);

    return NextResponse.json({ intent, results });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}
