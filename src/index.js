
import debounce from "debounce";
import { parseEvent } from "./parseEvent.js";
import { parseName } from "./parseName.js";
import { slug } from "./slug.js";

function processLinks () {
    document.querySelectorAll('.recordContainer').forEach(container => {
        const link = container.querySelector('a.recordTitle');
        const name = link.textContent.trim();
        const params = getParameters(container, link);
        if (!params) return;
        const colId = params.get('colId');
        const itemId = params.get('itemId');
        const url = createUrl(colId, itemId, name, container);
        if (!url) return;
        container.querySelectorAll('a.record_link').forEach(a => {
            a.classList.add(url.startsWith('/') ? 'unlocked' : 'external');
            a.setAttribute('href', url);
        });
    });

    document.querySelectorAll('.records_list_item').forEach(container => {
        const link = container.querySelector('.record_title a.record_name');
        const name = link.textContent.trim();
        const params = getParameters(container, link);
        if (!params) return;
        const colId = params.get('colId');
        const itemId = params.get('itemId');
        const url = createUrl(colId, itemId, name, container);
        if (!url) return;
        container.querySelectorAll('a.record_name').forEach(a => {
            a.classList.add(url.startsWith('/') ? 'unlocked' : 'external');
            a.setAttribute('href', url);
        });
        container.onclick = (e) => {
            e.stopPropagation();
        };
    });

    document.querySelectorAll('.record_match_action_container .record_match_action_icon.record_match_unconfirmed').forEach(a => {
        const matchId = a.getAttribute('data-match-id');
        if (a) {
            a.setAttribute('href', `javascript:recordMatches.recordMatchesList.toggleMatchConfirmationStatus('#${a.id}', '${matchId}')`);
        }
    });
};

function getParameters(container, link) {
    const cbExtraParameter = container.getAttribute('data-callback-extra-parameter');
    if (cbExtraParameter) {
        return new URLSearchParams(cbExtraParameter);
    }
    
    const href = link.href;
    if (/\/search-plans.php\?/.test(href)) {
        return new URL(href).searchParams;
    }

    return null;
}

function extractFromTable(container, field) {
    return document.evaluate(`.//tr[contains(td, "${field}:")]/td[2]|.//li[contains(span, "${field}")]/span[2]`, container).iterateNext()?.textContent;
}

function createUrl(colId, itemId, name, container) {
    switch (colId) {
        case '1': {
            const [_, siteId, familyTreeId, individualId] = itemId.match(/(\d+)-(\d+)-(\d+)/);
            return `/person-${(parseInt(familyTreeId) * 1000000 + parseInt(individualId))}_${siteId}_${siteId}/${slug(name)}`;
        }
        case '2': {
            return `/site-${itemId}/${slug(name)}`;
        }
        case '3': {
            return `/member-${itemId}_1/${slug(name)}`;
        }
        case '40001': {
            // Family Search
            const { firstName, lastName, birthName } = parseName(name);
            const params = new URLSearchParams(`self=${firstName}|${birthName || lastName}|1|1`);
            const birth = extractFromTable(container, 'Birth');
            if (birth) {
                const [date, place] = parseEvent(birth);
                params.append('birth', `${ place }|${ date }|1|1`);
            }
            const death = extractFromTable(container, 'Death');
            if (death) {
                const [date, place] = parseEvent(death);
                params.append('death', `${ place }|${ date }|1|1`);
            }

            return `https://www.familysearch.org/tree/find/name?${params}`;
        }
    }
    return null;
}

new MutationObserver(debounce(processLinks, 100)).observe(document, {
    childList: true, subtree: true
});

processLinks();
