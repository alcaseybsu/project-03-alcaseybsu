[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/E1rFec9K)
# CS 411 Project 3: **YOUR NAME HERE**

![auto-grading badge](https://github.com/bsu-cs-jb/YOUR-REPO-NAME-HERE/actions/workflows/classroom.yml/badge.svg)

- [ ] Replace the `YOUR-REPO-NAME-HERE` text above with the name of your
      repository and when you push this to GitHub a badge should appear showing
      "failing" or "passing" depending on the outcome of your last build. You
      may delete this instruction once it is working.

## Goal

Implement Project 3.

Refer to [CS 411 Project 3](https://bsu-cs-jb.github.io/cs-411-docs/project-03/)
and Canvas for the full specification and rubric.

The context and a fake "backend" have been provided and should not need to be
altered in any way. The AppContext will fetch data from the backend and populate
AppState. It will also poll the backend for updates to the Session and this will
update the AppState as well. The behavior of other users is simulated in
FakeBackend. There should be no reason to change any of those files unless
someone discovers a bug or issues with them. Otherwise, you should not change
them.

**Do not** change these files:

- `provided/AppContext.tsx`
- `provided/types.ts`
- `provided/utils.ts`
- `provided/genid.ts`
- `backend/FakeData.json`
- `backend/FakeBackend.ts`
- `backend/DataGen.ts`
- `App.tsx` - you may temporarily adjust the refresh

## README Tasks

<!-- prettier-ignore-start -->
> [!IMPORTANT]
> Complete these tasks as part of the project:
<!-- prettier-ignore-end -->

- [ ] Put your name at the top of the README
- [ ] Fix the auto-grading badge at the top of the README
- [ ] Replace "project-03-template" in [package.json](package.json) and
      [app.json](app.json) with the name of this repo.
