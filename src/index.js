
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		clearTimeout(timeout);
		timeout = setTimeout(function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		}, wait);
		if (immediate && !timeout) func.apply(context, args);
	};
}

function processLinks () {
    document.querySelectorAll('.searchResultsRecord').forEach(d => {
        const name = d.querySelector('a.recordTitle').textContent.trim().replace(/\W+/gu,'-').toLowerCase();
        const params = new URLSearchParams(d.getAttribute('data-callback-extra-parameter'));
        const colId = params.get('colId');
        const itemId = params.get('itemId');
        const url = createUrl(colId, itemId, name);
        if (url) {
            d.querySelectorAll('a.record_link').forEach(a => {
                a.classList.add('unlocked');
                a.setAttribute('href', url);
            });
        }
    });
    
    document.querySelectorAll('.result_list_row').forEach(d => {
        const link = d.querySelector('.record_title a.record_name');
        const name = link.textContent.trim().replace(/\W+/gu,'-').toLowerCase();
        const [,colId, itemId] = /record-(\d+)-([^//]+)/.exec(link.getAttribute('href')) ?? [];
        const url = createUrl(colId, itemId, name);
        if (url) {
            d.querySelectorAll('a.record_name').forEach(a => {
                a.style.setProperty('border', '1px solid black');
                a.setAttribute('href', url);
                //a.setAttribute('target', '_blank');
            });
        }
    });

    document.querySelectorAll('.records_list_item').forEach(d => {
        const link = d.querySelector('.record_title a.record_name');
        const name = link.textContent.trim().replace(/\W+/gu,'-').toLowerCase();
        const href = link.getAttribute('href');
        if (/search-plans.php\?/.test(href)) {
            const params = new URL(href).searchParams;
            const colId = params.get('colId');
            const itemId = params.get('itemId');
            const url = createUrl(colId, itemId, name);
            if (url) {
                d.querySelectorAll('a.record_name').forEach(a => {
                    a.classList.add('unlocked');
                    a.setAttribute('href', url);
                });
                d.onclick = (e) => {
                    e.stopPropagation();
                };
            }
        }
    });

    document.querySelectorAll('.record_match_action_container .record_match_action_icon.record_match_unconfirmed').forEach(a => {
        const matchId = a.getAttribute('data-match-id');
        if (a) {
            a.setAttribute('href', `javascript:recordMatches.recordMatchesList.toggleMatchConfirmationStatus('#${a.id}', '${matchId}')`);
        }
    });
};

function createUrl(colId, itemId, name) {
    switch (colId) {
        case '1': {
            const [_, siteId, familyTreeId, individualId] = itemId.match(/(\d+)-(\d+)-(\d+)/);
            return `https://www.myheritage.com/person-${(parseInt(familyTreeId) * 1000000 + parseInt(individualId))}_${siteId}_${siteId}/${name}`;
        }
        case '3': {
            return `https://www.myheritage.com/member-${itemId}_1/${name}`;
        }
        case '40001': {
            // Family Search
            const ix = name.lastIndexOf(' ');
            const firstName = name.substring(0, ix);
            const lastName = name.substring(ix + 1);
            return `https://www.familysearch.org/tree/find/name?self=${firstName}|${lastName}|1|1`;
        }
    }
    return null;
}

const contatiner1 = document.querySelector('.record_matches_results_list_container');
if (contatiner1) {
    new MutationObserver(debounce(processLinks, 100)).observe(contatiner1, { 
        childList: true, subtree: true
    });
}

const contatiner2 = document.querySelector('.result_list_container');
if (contatiner2) {
    new MutationObserver(debounce(processLinks, 100)).observe(contatiner2, { 
        childList: true, subtree: true
    });
}

const contatiner3 = document.querySelector('.results_container');
if (contatiner3) {
    new MutationObserver(debounce(processLinks, 100)).observe(contatiner3, { 
        childList: true, subtree: true
    });
}

processLinks();