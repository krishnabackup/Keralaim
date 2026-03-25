import  { Page } from "puppeteer";


// ---------------------------
// MAIN SCRAPER
// ---------------------------
export const scrapDetailsOfEachScheme = async (page : Page , url: string) => {

  await page.goto(url, { waitUntil: "domcontentloaded" });

  await page.waitForSelector("#details", { timeout: 10000 }).catch(() => {});

  // ---------------------------
  // SAFE NODE EXTRACTOR (STRUCT + TEXT)
  // ---------------------------
  const extractNode = (node: Element) => {
    const result: any = { text: "", links: [] as any[] };

    const walk = (el: ChildNode) => {
      if (el.nodeType === Node.TEXT_NODE) {
        result.text += (el.textContent ?? " ") + " ";
      }

      if (el.nodeType === Node.ELEMENT_NODE) {
        const element = el as HTMLElement;

        if (element.tagName === "A") {
          result.links.push({
            text: element.textContent?.trim(),
            href: element.getAttribute("href"),
          });

          result.text += element.textContent + " ";
        } else {
          element.childNodes.forEach(walk);
        }
      }
    };

    node.childNodes.forEach(walk);

    return {
      text: result.text.replace(/\s+/g, " ").trim(),
      links: result.links,
    };
  };

  // ---------------------------
  // STRUCTURED PARSER
  // ---------------------------
  const parseContent = (container: Element) => {
    const result: any[] = [];

    Array.from(container.children).forEach((child) => {
      const tag = child.tagName.toLowerCase();

      if (tag === "ul" || tag === "ol") {
        const items = Array.from(child.querySelectorAll("li")).map(
          (li) => li.textContent?.trim() ?? ""
        );

        result.push({ type: "list", items });
      } else if (tag === "table") {
        const rows = Array.from(child.querySelectorAll("tr")).map((row) =>
          Array.from(row.querySelectorAll("th,td")).map(
            (cell) => cell.textContent?.trim() ?? ""
          )
        );

        result.push({ type: "table", rows });
      } else {
        const data = extractNode(child);

        if (data.text) {
          result.push({
            type: "text",
            value: data.text,
            links: data.links.length ? data.links : undefined,
          });
        }
      }
    });

    return result;
  };

  // ---------------------------
  // PLAIN TEXT PARSER
  // ---------------------------
  const parsePlainText = (container: Element) => {
    let text = "";

    const walk = (el: ChildNode) => {
      if (el.nodeType === Node.TEXT_NODE) {
        text += (el.textContent ?? " ") + " ";
      }

      if (el.nodeType === Node.ELEMENT_NODE) {
        const element = el as HTMLElement;

        if (element.tagName === "BR") {
          text += "\n";
        } else {
          element.childNodes.forEach(walk);
        }
      }
    };

    container.childNodes.forEach(walk);

    return text.replace(/\s+/g, " ").trim();
  };

  // ---------------------------
  // SAFE EXTRACTOR
  // ---------------------------
  const extractStructured = (id: string) => {
    const el = document.querySelector(`#${id}`);
    if (!el) return { structured: [], plainText: "" };

    const container =
      el.querySelector(".markdown-options") || el;

    return {
      structured: parseContent(container),
      plainText: parsePlainText(container),
    };
  };

  // ---------------------------
  // RUN MAIN PAGE PARSING
  // ---------------------------
  const data = await page.evaluate(() => {
    const extractNode = (node: Element) => {
      const result: any = { text: "", links: [] };

      const walk = (el: ChildNode) => {
        if (el.nodeType === Node.TEXT_NODE) {
          result.text += (el.textContent ?? " ") + " ";
        }

        if (el.nodeType === Node.ELEMENT_NODE) {
          const element = el as HTMLElement;

          if (element.tagName === "A") {
            result.links.push({
              text: element.textContent?.trim(),
              href: element.getAttribute("href"),
            });

            result.text += element.textContent + " ";
          } else {
            element.childNodes.forEach(walk);
          }
        }
      };

      node.childNodes.forEach(walk);

      return {
        text: result.text.replace(/\s+/g, " ").trim(),
        links: result.links,
      };
    };

    const parseContent = (container: Element) => {
      const result: any[] = [];

      Array.from(container.children).forEach((child) => {
        const tag = child.tagName.toLowerCase();

        if (tag === "ul" || tag === "ol") {
          const items = Array.from(child.querySelectorAll("li")).map(
            (li) => li.textContent?.trim() ?? ""
          );

          result.push({ type: "list", items });
        } else {
          const data = extractNode(child);

          if (data.text) {
            result.push({
              type: "text",
              value: data.text,
              links: data.links.length ? data.links : undefined,
            });
          }
        }
      });

      return result;
    };

    const parsePlainText = (container: Element) => {
      let text = "";

      const walk = (el: ChildNode) => {
        if (el.nodeType === Node.TEXT_NODE) {
          text += (el.textContent ?? " ") + " ";
        }

        if (el.nodeType === Node.ELEMENT_NODE) {
          const element = el as HTMLElement;

          if (element.tagName === "BR") {
            text += "\n";
          } else {
            element.childNodes.forEach(walk);
          }
        }
      };

      container.childNodes.forEach(walk);

      return text.replace(/\s+/g, " ").trim();
    };

    const extractSection = (id: string) => {
      const el = document.querySelector(`#${id}`);
      if (!el) return { structured: [], plainText: "" };

      const container =
        el.querySelector(".markdown-options") || el;

      return {
        structured: parseContent(container),
        plainText: parsePlainText(container),
      };
    };

    return {
      details: extractSection("details"),
      benefits: extractSection("benefits"),
      eligibility: extractSection("eligibility"),
      exclusions: extractSection("exclusions"),
      documentsRequired: extractSection("documents-required"),
      applicationProcess: extractSection("application-process"),
    };
  });

  // ---------------------------
  // TAB SCRAPER (ONLINE/OFFLINE)
  // ---------------------------
  const clickTab = async (keyword: string) => {
    const clicked = await page.evaluate((keyword) => {
      const spans = Array.from(
        document.querySelectorAll("#application-process span")
      );

      const target = spans.find((el) =>
        (el.textContent ?? "").toLowerCase().includes(keyword)
      );

      if (target) {
        (target as HTMLElement).click();
        return true;
      }

      return false;
    }, keyword);

    if (!clicked) return { structured: [], plainText: "" };

    await page
      .waitForFunction(
        () =>
          (document.querySelector(
            "#application-process .markdown-options"
          )?.textContent?.length ?? 0) > 0,
        { timeout: 5000 }
      )
      .catch(() => {});

    // IMPORTANT: ALL DOM WORK INSIDE BROWSER CONTEXT
    const result = await page.evaluate(() => {
      const container =
        document.querySelector("#application-process .markdown-options") ||
        document.querySelector("#application-process");

      if (!container) {
        return { structured: [], plainText: "" };
      }

      const structured: any[] = [];

      container.childNodes.forEach((child) => {
        const el = child as HTMLElement;

        if (el.tagName === "UL" || el.tagName === "OL") {
          const items = Array.from(el.querySelectorAll("li")).map(
            (li) => li.textContent?.trim() ?? ""
          );

          structured.push({ type: "list", items });
        } else {
          const text = el.textContent?.trim();

          if (text) {
            structured.push({ type: "text", value: text });
          }
        }
      });

      let plainText = "";
      const walk = (el: ChildNode) => {
        if (el.nodeType === Node.TEXT_NODE) {
          plainText += (el.textContent ?? " ") + " ";
        }

        if (el.nodeType === Node.ELEMENT_NODE) {
          const element = el as HTMLElement;

          if (element.tagName === "BR") {
            plainText += "\n";
          } else {
            element.childNodes.forEach(walk);
          }
        }
      };

      container.childNodes.forEach(walk);

      return {
        structured,
        plainText: plainText.replace(/\s+/g, " ").trim(),
      };
    });

    return result;
  };

  // ---------------------------
  // RUN TABS IN PARALLEL
  // ---------------------------
  const [online, offline] = await Promise.all([
    clickTab("online"),
    clickTab("offline"),
  ]);

  return {
    ...data,
    applicationProcess: {
      online,
      offline,
    },
  };
};
