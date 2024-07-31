# Sách Giáo Khoa API

[Web branch](https://github.com/nguynkhn/sachgiaokhoa/tree/web/)

This GitHub repository (branch `api`) serves as a *database* to store book information. All data is fetched and updated monthly using GitHub Actions.

API URL: `https://raw.githubusercontent.com/nguynkhn/sachgiaokhoa/api/v<version>`. Current version is `1`.

## Running the Fetch Script

To update the database, run the fetch script:

```bash
node fetch.js # Node.js >= 18 is required
```

### Environment Variables

Ensure the following environment variables are set:

- `HANHTRANGSO_EMAIL` and `HANHTRANGSO_PASSWORD`: Email and password registered at [Hành Trang Số](https://hanhtrangso.nxbgd.vn/). See the default account in the workflow file.

## Endpoints

- `/booksets`: Retrieves a list of all book sets.
- `/<bookset>/books`: Retrieves a list of all books within a specific book set.
- `/<bookset>/<book>`: Retrieves details of a specific book identified by its slug.
