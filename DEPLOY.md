# Setting up and launching the site

Written for whoever at Boulder Feet Forward (or helping BFF) sets this up. You do not need to be a developer. You do need to be comfortable following steps carefully. Set aside about an hour for parts 1 to 5, plus a little extra for each sign-up form.

*Designed and built as a gift by Benjamin Life ([@omniharmonic](https://x.com/omniharmonic)).*

---

## The plan in one paragraph

The site's files live in a **private** GitHub repository that BFF owns. Every time something changes, GitHub builds the site and publishes it with GitHub Pages. While the site is being finished, every page is **password-protected**. When BFF is ready, you delete one step and it becomes public at feetforwardboulder.org.

## What "private and password-protected" really means

Please read this once. It is honest, and it is good enough for a work-in-progress site.

- The **code and content** are private because the repository is private. Only people BFF invites can see or change them.
- The **published pages** are encrypted in the build. A visitor sees a password box. The text only decrypts in their browser after they enter the password.
- The **images, fonts, styles and scripts** are not encrypted. They are ordinary files at long web addresses. This site has no photos of neighbors, so there is nothing sensitive there, but it is not a vault.
- Use a **long passphrase** (16 characters or more, for example four unrelated words). Anyone with the password can read the site. Change it any time by editing the secret and republishing.
- Search engines are told to stay away while the site is gated.
- GitHub also sells a true "private Pages" feature (GitHub Enterprise Cloud). It is not needed here.

---

## Part 1. GitHub account and plan

1. Create a GitHub **organization** for BFF (free). Something like `boulderfeetforward`. Go to github.com, click your picture, "Your organizations", "New organization".
2. **Apply for GitHub for Nonprofits** at <https://nonprofits.github.com>. Verified nonprofits get a free GitHub Team plan, which allows Pages from a private repository. (GitHub's page says it is for 501(c)(3) or equivalent organizations.)
3. If BFF does not qualify or you do not want to wait, two fallbacks work:
   - Put the repository under a personal GitHub account on **GitHub Pro** (a few dollars a month). Pages works from private repositories on Pro, Team and Enterprise plans, and not on Free.
   - Or host somewhere else that has a free tier and password options (Cloudflare Pages, Netlify). The build and the gate step in this project work the same way. Ask a developer to adapt `deploy.yml`.

A repository on the Free plan has to be public to use Pages. Do not do that while the site is gated, because the content in a public repository is readable by anyone.

## Part 2. Put the project in a private repository

1. In your organization, click **New repository**. Name it `website`. Choose **Private**. Leave everything else empty (no README).
2. On a computer with Git installed, open a terminal in the project folder and run, replacing `ORG` with your organization name:

   ```bash
   git init -b main
   git add .
   git commit -m "Boulder Feet Forward website"
   git remote add origin https://github.com/ORG/website.git
   git push -u origin main
   ```
   (If you prefer clicking, GitHub Desktop does the same thing. Choose "Add local repository", then "Publish repository", and keep "Keep this code private" ticked.)
3. Open `public/admin/config.yml` and change the line `repo: OWNER/REPO` to `repo: ORG/website`. Commit and push that change.

## Part 3. Turn on GitHub Pages

1. In the repository: **Settings**, then **Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.

## Part 4. Set the password

1. **Settings**, then **Secrets and variables**, then **Actions**, then **New repository secret**.
2. Name: `SITE_PASSWORD`. Value: your passphrase. Save.
3. Tell staff and trusted reviewers the password in person or in a password manager, not in a public place.

If you forget to do this, the build stops with a clear message instead of publishing an unprotected site.

## Part 5. First publish

1. Go to the **Actions** tab. The workflow named **Build and publish** runs on every push. If it did not start, click it and then **Run workflow**.
2. When it finishes (about two minutes) the **deploy** step shows the site address. It looks like `https://ORG.github.io/website/`.
3. Open it. You should see the BFF password page. Enter the password. The site loads.
4. Open `https://ORG.github.io/website/admin/`. This is the editor (see EDITING-GUIDE.md).

If a step fails, click it in the Actions tab to read the error. The most common causes are Pages not set to "GitHub Actions" (Part 3) or the secret missing (Part 4).

## Part 6. Let staff edit

1. Add each editor to the organization, then to the repository with **Write** access (Settings, Collaborators and teams).
2. Each editor signs in at `/admin/` using a **personal access token**. Step-by-step instructions are in EDITING-GUIDE.md. No other setup is needed.
3. *Optional, for later:* a normal "Sign in with GitHub" button needs a small free sign-in helper (Sveltia's "CMS Authenticator", which runs on Cloudflare Workers) and a GitHub OAuth app. The instructions are at <https://sveltiacms.app/en/docs/backends/github>. When it is running, uncomment `base_url` in `public/admin/config.yml` and put its address there.

## Part 7. Volunteer sign-ups (free, goes to BFF's own Google Sheet)

1. Follow the steps at the top of `integrations/volunteer-apps-script.gs`. It takes about five minutes while signed in as the BFF Google account.
2. Paste the web app address into the editor: **Site settings and numbers**, then **Contact, links and sign-ups**, then **Volunteer sign-up address**. Save.
3. Test it on the live site: Volunteer page, "I'm in", fill in the form. A new row appears in the Sheet.
4. Until the address is set, the form opens a pre-filled email to libby@feetforwardboulder.org instead. Nothing is lost.

The Sheet is yours. Add columns, filters or a pivot table for hours however you like. Nothing on the website reads from it.

## Part 8. Newsletter (free)

The site's signup form is ready to connect to **EmailOctopus**. At the time of writing its free plan includes up to 2,500 subscribers and 10,000 emails a month, one signup form, and a small EmailOctopus mark in emails. Check their pricing page for current limits, and whether the free plan includes a welcome-email automation.

1. Create an EmailOctopus account and a **list** named "BFF newsletter".
2. In the list, open **Forms**, then **Embedded form**. Choose the HTML version. Look for three things in the code:
   - the form's `action` address (it looks like `https://emailoctopus.com/lists/…/members/embedded/1.3/add`)
   - the email field's name (usually `email_address`)
   - a hidden spam-trap field with a long name starting `hp` (copy the whole name)
3. In the site editor, open **Contact, links and sign-ups** and fill in **Newsletter form address**, **Newsletter email field name** and **Newsletter spam-trap field name**. Save.
4. Test with your own email. People are told to check their email; confirm whether you want double opt-in in the EmailOctopus list settings.

Until the address is set, the form opens a pre-filled email asking to be added by hand.

If you outgrow it or want something else (Buttondown, Mailchimp), only these three settings change.

## Part 9. Donations

Giving goes through the existing Zeffy forms. To add or change one, edit **Ways to fund something specific** or **Giving links** in the editor. The "Give where it's needed" button sends people to the Zeffy form named in **Giving links**.

Zeffy lets you create a form for each program. If you add one, paste its link into the matching program.

---

## Launching publicly

Do these in order when BFF is ready, and after everything in `docs/TO-CONFIRM.md` is settled.

1. **Remove the password.** Open `.github/workflows/deploy.yml` and delete the step named "Password-protect the site" (the lines between the two `DELETE THIS` comments). Commit.
2. **Allow search engines.** In the same file, change `PUBLIC_NOINDEX` to `"false"`.
3. **Hide editor notes.** Change `PUBLIC_SHOW_DRAFTS` to `"false"`.
4. **Hide quotes you do not have permission for.** Change `PUBLIC_REQUIRE_CONSENT` to `"true"`, or switch off "Waiting on written OK" on each quote you have approval for.
5. **Use your own domain.**
   - In **Settings**, **Pages**, enter `feetforwardboulder.org` as the custom domain, and tick **Enforce HTTPS** once it is available.
   - At the place where the domain is registered, add the DNS records GitHub shows (see <https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site>).
   - The workflow reads the domain from GitHub Pages, so the site's links adjust on their own.
   - Keep the email addresses working. Changing where the website lives does not affect email, but be careful not to remove existing mail (MX) records.
6. The old Google Sites addresses (`/our-work/…`, `/about-us/…`, `/get-involved/…`) redirect to the new pages automatically.
7. After the domain is live, remember to turn the old Google Site off or point it to the new address.

## If something goes wrong

- **A change did not appear.** Look at the Actions tab. A red cross means the build failed, and the log says why. The previous version stays live.
- **A bad edit.** Open the repository, click **Commits**, find the change, and click **Revert**. The site rebuilds with the old content.
- **Password page shows but the password is rejected.** The secret may have a stray space. Re-enter it, then re-run the workflow.
- **Locked out of the editor.** The token may have expired. Make a new one (EDITING-GUIDE.md).
