# Contributing to Fetch It

First off all, thanks for taking the time to contribute!

Bug reports, feature suggestions, documentation improvements, and pull requests of all kinds, everything is welcome!

---

## How to Contribute

### 1. Fork the Repository

Click the **"Fork"** button at the top right of the [repo](https://github.com/rucev/fetch-it) to create your own copy.

---

### 2. Clone and Create a Feature Branch

```bash
git clone https://github.com/rucev/fetch-it
cd fetch-it
git checkout -b feature/my-awesome-feature
```

### 3. Open an Issue (Optional but Recommended)

Before writing code, open an issue describing what you're working on.

This avoids duplicated work and gives a chance to discuss the approach.

### 5. Install dependencies

- Install Husky on the project root folder

```bash
npm i
```

- Then install the app folder dependencies
```bash
cd app
npm i
```

Husky will ensure pre-commit hooks are in place to maintain code quality

### 5. Make Your Changes

- Follow the existing code style.
- Keep components modular.
- Test your changes using:

```bash
npm run test
```

If you added a new feature or fixed a bug, please, **create a test for it**.

### 6. Commit with a Clear Message

```bash
git commit -m "add feature #<issue-number>"
```

Use lowercase, english and the issue number as the last item of the commit message.

Start the commit with one of the following verbs to keep them standarized:
- `add`
- `fix`
- `delete`
- `style`
- `refactor`
- `update`
- `test`
- `build`
- `change`
- `improve`
- `start`
- `wip` (work in progress).

### 7. Push and Open a Pull Request.

Describe what you changed and why in the PR description.