
import debounce from "debounce";
import { parseEvent } from "./parseEvent.js";
import { parseName } from "./parseName.js";
import { slug } from "./slug.js";

function processLinks () {
    document.querySelectorAll(".recordContainer").forEach(container => {
        const url = createUrl(container, "a.recordTitle");
        if (!url) return;

        container.querySelectorAll("a.record_link").forEach(a => {
            a.classList.add(url.startsWith("/") ? "unlocked" : "external");
            a.setAttribute("href", url);
        });
    });

    document.querySelectorAll(".records_list_item").forEach(container => {
        const url = createUrl(container, ".record_title a.record_name");
        if (!url) return;

        container.querySelectorAll("a.record_name").forEach(a => {
            a.classList.add(url.startsWith("/") ? "unlocked" : "external");
            a.setAttribute("href", url);
        });
        container.onclick = (e) => e.stopPropagation();
    });

    document.querySelectorAll(".record_match_action_container .record_match_action_icon.record_match_unconfirmed").forEach(a => {
        const matchId = a.getAttribute("data-match-id");
        if (a) {
            a.setAttribute("href", `javascript:recordMatches.recordMatchesList.toggleMatchConfirmationStatus("#${a.id}", "${matchId}")`);
        }
    });
};

function getParameters(container, link) {
    const cbExtraParameter = container.getAttribute("data-callback-extra-parameter");
    if (cbExtraParameter) {
        return new URLSearchParams(cbExtraParameter);
    }
    
    const href = link.href;
    if (/\/search-plans.php\?/.test(href)) {
        return new URL(href).searchParams;
    }

    if (/\/paywall\?/.test(href)) {
        return new URL(href).searchParams;
    }

    return;
}

function extractFromTable(container, field) {
    return document.evaluate(`.//tr[contains(td, "${field}:")]/td[2]|.//li[contains(span, "${field}")]/span[2]`, container).iterateNext()?.textContent;
}

function createUrl(container, nameSelector) {
    const link = container.querySelector(nameSelector);
    if (!link) return;

    const name = link.textContent.trim();
    const params = getParameters(container, link);
    if (!params) return;

    const colId = params.get("colId");
    const itemId = params.get("itemId");

    switch (colId) {
        case "1": {
            const [, siteId, familyTreeId, individualId] = itemId.match(/(\d+)-(\d+)-(\d+)/);
            return `/person-${(parseInt(familyTreeId) * 1000000 + parseInt(individualId))}_${siteId}_${siteId}/${slug(name)}`;
        }
        case "2": {
            return `/site-${itemId}/${slug(name)}`;
        }
        case "3": {
            return `/member-${itemId}_1/${slug(name)}`;
        }
        case "40000":{
            // Geni
            const { firstName, lastName, birthName } = parseName(name);
            if (!firstName && !lastName && !birthName) {
                return;
            }
 
            const params = new URLSearchParams(`?search_advanced=open&names=${[firstName, lastName, birthName].join(" ")}`);
            const birth = extractFromTable(container, "Birth");
            if (birth) {
                const [date, place] = parseEvent(birth);
                params.append("birth[year]", date);
                params.append("birth[location]", place);
            }

            const death = extractFromTable(container, "Death");
            if (death) {
                const [date, place] = parseEvent(death);
                params.append("death[year]", date);
                params.append("death[location]", place);
            }
            
            if (birth || death) {
                params.append("search_advanced", "open");
            }

            return `https://www.geni.com/search?${params}`;
        }

        case "40001": {
            // Family Search
            const thumbnail = container.querySelector(".recordImageBox img.recordImage")?.getAttribute("src");
            if (thumbnail?.includes("get-fs-image.php")) {
                const person = new URL(thumbnail).searchParams.get("person");
                return `https://www.familysearch.org/tree/person/${person}`;
            }
    
            const { firstName, lastName, birthName } = parseName(name);
            if (!firstName && !lastName && !birthName) {
                return;
            }

            const params = new URLSearchParams();
            if (firstName) {
                params.append("q.givenName", firstName);
            }

            const surname = birthName || lastName;
            if (surname) {
                params.append("q.surname", surname);
            }

            const birth = extractFromTable(container, "Birth");
            if (birth) {
                const [date, place] = parseEvent(birth);
                if (date) {
                    const [year] = /\d{4}/.exec(date);
                    params.append("q.birthLikeDate.from", year);
                    params.append("q.birthLikeDate.to", year);
                }
                if (place) {
                    params.append("q.birthLikePlace", place);
                }
            }

            const death = extractFromTable(container, "Death");
            if (death) {
                const [date, place] = parseEvent(death);
                if (date) {
                    const [year] = /\d{4}/.exec(date);
                    params.append("q.deathLikeDate.from", year);
                    params.append("q.deathLikeDate.to", year);
                } 
                if (place) {
                    params.append("q.deathLikePlace", place);
                }
            }

            return `https://www.familysearch.org/search/tree/results?${params}`;
        }
    }

    return;
}

new MutationObserver(debounce(processLinks, 100)).observe(document, {
    childList: true, subtree: true
});

processLinks();
