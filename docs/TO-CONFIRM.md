# To confirm before launch

Written for Libby and the BFF team. Everything on the site came from the BFF Information Packet and the old site, and where something was missing it was filled in with plain, careful wording. This is the list of what a person at BFF should read and confirm. None of it blocks the site from working.

Switch each item off by editing it in the site editor. When the `PUBLIC_SHOW_DRAFTS` setting is `true`, pages still marked "Draft" show a small note to editors. Turn it off at launch (see DEPLOY.md).

## Numbers that don't agree yet

The packet and the old site give different figures. The new site uses the packet. Please decide which is right, and update **Impact numbers** and **Budget** in the editor.

| Topic | Old site said | Packet says |
|---|---|---|
| Meals | "an average of 140 meals per week" | about 458 meals a month, and 13,705 since 2024 |
| Care items | "about 150 items per week" | about 11,360 items a year |
| People reached | about 85 at Tuesdays | about 120 different people in a typical week |
| Event start | Tuesdays since 2020 | meals counted since 2024 |

The site says "about 85 come to Tuesdays in the Park" and "about 120 different people in a typical week, across both weekly events." Confirm that is how the 120 is counted.

## Pages written from the packet

- **Case management** was a missing page. It is built from the packet's description and is marked Draft.
- **Volunteer** was an empty page. The text and the four questions are drafted and marked Draft. Please check:
  - minimum age and any orientation before a first shift
  - what to wear or bring
  - group size limits
  - how hours are confirmed ("our shift lead confirms who was there") and the bus-pass rule (three or more hours a week)
  - the line "Arrive a little early. Our shift lead will show you the ropes before we start."
- Three questions end with "(Draft: Libby to confirm...)". Delete that phrase once checked.

## Quotes from neighbors

Every quote is marked **Waiting on written OK to publish**. Before launch, get a yes in writing from each person (the neighbors quoted; names are kept out of the public repository until each has said yes), then switch that off in the editor. Any quote still waiting can be hidden automatically with `PUBLIC_REQUIRE_CONSENT=true`. If anyone has a video story, add the link and a "Watch their story" link appears.

## Small things worth a look

- **Newsletter** says "a few times a year." Change it to your real plan (it appears in the footer, on the home page and on the newsletter page).
- **"Come as you are. No sign-up, no questions."** is on the home page and Contact page. It reflects the zero-barrier approach. Confirm you are happy to say it that way.
- **Wish list wording** says anything ordered ships directly to you. That is from the old site.
- **Giving amounts** ("$19 buys food for about 10 meals," "$27 stocks about 100 care items," "$5 pays for one wash-and-dry load," "$14 buys a ten-ride pass") are worked out from packet figures and marked approximate. Confirm them, or change them in **Ways to fund something specific**.
- **External links** were copied from the old site. They have not been re-checked since.
- **Photography:** the site uses line art and no photos of neighbors. If you add photos, get consent and add a way to show them.
- **Domain and email:** the site is meant to live at feetforwardboulder.org. See DEPLOY.md for what changes at the domain.
