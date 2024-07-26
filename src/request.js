import { interceptXHR } from "./interceptXHR.js";
import { slug } from "./slug.js";

interceptXHR("search_in_historical_records", (json) => {
    json.data.search_query_upload.response.results.data.forEach((e) => {
        console.log(e.user_info.is_purchased || e.record.collection.is_free || e.record.collection.is_temporary_free);
        if (e.record.collection.is_free || e.record.collection.is_temporary_free) {
            return;
        }

        const colId = e.record.collection.id.replace("collection-", "");
        if (colId === "1") {
            const [, siteId, familyTreeId, individualId] = e.record.id.match(/(\d+)_(\d+)_(\d+)/);
            e.user_info.link = `/profile-${siteId}-${parseInt(familyTreeId) * 1000000 + parseInt(individualId)}/${slug(e.record.name)}`;
            e.record.name = "🔓 " + e.record.name;
        } else if (colId === "40001") {
            if (e.record.thumbnail?.url.includes("get-fs-image.php")) {
                const person = new URL(e.record.thumbnail.url).searchParams?.get("person");
                if (person) {
                    e.user_info.link = `https://www.familysearch.org/tree/person/${person}`;
                    e.record.name = "🔓 " + e.record.name;
                }
            }
        }
    });
    return json;
});
