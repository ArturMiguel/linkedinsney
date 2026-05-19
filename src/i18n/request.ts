import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const headerStore = await headers();

  let locale = cookieStore.get("linkedinsney_locale")?.value;

  if (!locale || !["pt-BR", "en-US", "es-ES"].includes(locale)) {
    const acceptLang = headerStore.get("accept-language") ?? "";
    const browserLang = acceptLang.split(",")[0]?.trim();

    if (browserLang?.startsWith("es")) {
      locale = "es-ES";
    } else if (browserLang?.startsWith("en")) {
      locale = "en-US";
    } else {
      locale = "pt-BR";
    }
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
