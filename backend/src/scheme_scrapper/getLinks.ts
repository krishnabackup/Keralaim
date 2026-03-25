import puppeteer from "puppeteer";

const getCurrentPage = async (page: any) => {
  return await page.evaluate(() => {
    return document.querySelector("li.bg-green-700")?.textContent?.trim();
  });
};

export const getLinks = async () => {
  
  const browser = await puppeteer.launch({
  headless: false,
  defaultViewport: null, // full screen
  args: ["--start-maximized"]
});

  const page = await browser.newPage();

  await page.goto("https://www.myscheme.gov.in/search/state/Kerala");

  // ✅ STEP 1: Click "All Schemes"
  await page.waitForSelector("a[href*='/schemes/']");

// capture old data
const beforeLinks = await page.$$eval(
  "a[href*='/schemes/']",
  els => els.map(el => el.href)
);

// click All Schemes
await page.evaluate(() => {
  const spans = Array.from(document.querySelectorAll("span"));

  const target = spans.find(el =>
    el.textContent?.toLowerCase().includes("all schemes")
  );

  if (target) {
    const clickable = target.closest("div");
    (clickable as HTMLElement)?.click();
  }
});

// ✅ WAIT FOR DATA CHANGE (REAL FIX)
await page.waitForFunction(
  (oldLinks) => {
    const currentLinks = [...document.querySelectorAll("a[href*='/schemes/']")]
      .map(el => (el as HTMLAnchorElement).href);

    return currentLinks.length > 0 &&
           currentLinks[0] !== oldLinks[0];
  },
  { timeout: 7000 },
  beforeLinks
);

const testLinks = await page.$$eval(
  "a[href*='/schemes/']",
  els => els.map(el => el.href)
);

console.log("First link after tab switch:", testLinks[0]);

  await page.waitForSelector("a[href*='/schemes/']");

  const links = new Set<string>();
  let count = 1; // ✅ moved outside loop

  while (true) {
    const prevPage = await getCurrentPage(page);

    const prevFirstLink = await page.$eval(
    "a[href*='/schemes/']",
    (el) => (el as HTMLAnchorElement).href
  );

    const newLinks = await page.$$eval(
      "a[href*='/schemes/']",
      els => els.map(el => el.href)
    );

    newLinks.forEach(l => links.add(l));

    console.log(`${count}) Collected: ${links.size}`);
    count++; // ✅ correct increment

    // ✅ click next
const nextButton = await page.$("ul svg.cursor-pointer:last-of-type");
console.log(nextButton);
if (!nextButton) break;

await nextButton.click();



    // ✅ WAIT FOR PAGE CHANGE (CRITICAL)
      const changed = await page.waitForFunction(
    (prevPage, prevLink) => {
      const currentPage = document
        .querySelector("li.bg-green-700")
        ?.textContent?.trim();

      const currentLink = (
  document.querySelector("a[href*='/schemes/']") as HTMLAnchorElement | null
)?.href;

      return currentPage !== prevPage || currentLink !== prevLink;
    },
    { timeout: 7000 },
    prevPage,
    prevFirstLink
  ).catch(() => null);

    // ❗ STOP IF NO CHANGE → LAST PAGE
    if (!changed) {
      console.log("Reached last page");
      break;
    }
  }

  await browser.close();

  console.log("Final Links:", [...links]);
};

getLinks();