# Editing the site

For Boulder Feet Forward staff. You do not need to know how to code. Anything you change here is saved safely, and you can undo it.

*Designed and built as a gift by Benjamin Life ([@omniharmonic](https://x.com/omniharmonic)).*

---

## Open the editor

1. Go to your site address and add `/admin/` to the end. For example `https://boulderfeetforward.org/admin/`.
2. Click **Sign in with token**.
3. The first time, you need a **token**. It is a long password that lets the editor save changes for you.

### Make your token (once, about two minutes)

1. Sign in at github.com with your own account. (Someone with admin access must have added you to the BFF repository with **Write** access first.)
2. The editor's sign-in box has a link to GitHub's token page. Click it. If not, go to GitHub, click your picture, then **Settings**, then **Developer settings**, then **Personal access tokens**, then **Fine-grained tokens**, then **Generate new token**.
3. Give it a name like "BFF site editor". Set it to expire in a year.
4. Under **Repository access**, choose **Only select repositories** and pick the BFF website repository.
5. Under **Permissions**, **Repository permissions**, set **Contents** to **Read and write**. Leave the rest alone.
6. Click **Generate token**, copy it, and paste it into the editor.

The token is saved in your browser, so you stay signed in on that computer. **Do not share it or post it anywhere.** It acts as you. If you lose track of one, delete it on the same GitHub page and make a new one.

### Want to try it first?

You do not have to commit to anything to see how it feels. Ask whoever set up the site to sit with you and sign in while you watch. Make a small change (for example, change a team member's role), press **Save**, and watch it appear on the site in about a minute. Then undo it from GitHub's **Commits** list, or just change it back.

Nobody can sign in until they have been added to the repository with **Write** access (Settings, Collaborators). That is also how you take access away: remove the person, and delete their token.

---

## What each section changes

| In the editor | What it controls on the site |
|---|---|
| **Pages (text)** | The wording of Our mission (About page), Peer support, Case management and Volunteer. |
| **Quotes from neighbors** | The quote carousel on the home page and the Impact page. |
| **Ways to fund something specific** | The four programs on the Give page: meals, care supplies, laundry, rides. |
| **Weekly events and volunteer shifts** | Tuesdays in the Park and Friday Breakfast Club: times, what is there, and the volunteer shifts. |
| **Team** | The people on the About page. |
| **Volunteer questions** | The questions and answers at the bottom of the Volunteer page. |
| **Site settings and numbers** | Phone, email, mailing address, social links, giving links, the sign-up connections, all the impact numbers, the budget, the wellness wheel, and partners. |

Each item shows what it controls in plain words. When you are unsure, look at the live page, find the sentence, and search for a few of its words.

---

## Everyday jobs

### Change the time or place of an event
**Weekly events and volunteer shifts**, open the event, change **Time** or **Place**, then **Save**. The Work, Volunteer and Contact pages all update. The "Next:" date on those pages works itself out.

### Add a one-off special event
**Weekly events and volunteer shifts**, **New Event**. Set **Kind** to `special`, put the date as `2026-12-05` in **Weekday**, and set **Hide after this date** if you want it to disappear on its own.

### Update the numbers
**Site settings and numbers**, **Impact numbers**. Change a number and the "as of" date, then Save. The home page and the Impact page both use them. If you change a number that appears in the Budget, update it there too.

### Add or hide a quote
**Quotes from neighbors**, **New Quote**. Use the person's exact words. **Leave "Waiting on written OK to publish" switched on until the person has said yes in writing.** It shows an internal flag on the draft site. At launch, quotes still waiting can be left out automatically (see DEPLOY.md). To remove a quote from the site, delete it, or move it later in the **Order** and leave it. Deleting can be undone from GitHub's history.

### Add a video to a quote
Paste the link in **Link to a video**. A "Watch their story" link appears under the quote.

### Change what a gift pays for
**Ways to fund something specific**. Change the **What a gift does** sentence or the Zeffy link. Keep amounts honest: say "approximately" when it is an estimate (the "approximate" switch does this).

### Change the budget
**Site settings and numbers**, **Budget**. Edit a line item or add one. The bar and the totals are shown exactly as you enter them, so make sure the line items add up to the tier totals, and the tiers to the whole.

### Edit the wellness wheel
**Site settings and numbers**, **Wellness wheel**. Each dimension has an introduction and three lines, one for each step. Keep each line short. Changing "Position on the wheel" moves a dimension around the circle. Position 0 is at the top, and positions go clockwise.

### Add a team member or a partner
**Team**, **New Person**. Partners are in **Site settings and numbers**, **Partners and links**.

### Turn off the "Draft for Libby" note
Open the page under **Pages (text)**, read it, fix anything that is off, and switch **Draft** off.

---

## After you save

Each time you press **Save** the editor sends your change to GitHub, and the site rebuilds itself. It takes **about two minutes** before the live page changes. Nothing bad happens if you save several things in a row.

If a change never shows up, ask whoever manages the GitHub account to open the **Actions** tab and check for a red cross. The site keeps showing the last version that worked.

## Undo something

On GitHub, open the repository, click **Commits**, find the change by its time and message, and click **Revert**. The site rebuilds with the older text.

---

## What the editor can't do

The look and layout of the site (colors, fonts, the trail, the wheel's design, adding a brand-new page, changing the menu) are in the code. They don't change from the editor. For those, ask a web person to open `README.md` and follow it. Everything is documented, and nothing depends on whoever built it.

## Writing for the site

A few habits keep the site consistent:

- Say "neighbors" and "peers," as the mission page does.
- Short sentences. Name what a button does: "Give where it's needed," "Sign me up."
- Put dates on numbers ("as of October 2026") and change them when you update the number.
- Don't put anyone's photo, full name or story on the site without their written OK.
