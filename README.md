# Huimang

**Huimang** is a versatile CRUD API developed by **Purrquinox**. It serves as a centralized solution for managing blogs across our services, with added flexibility to store and handle various types of data.

## Features

-   **Blog Management**: Seamless creation, retrieval, updating, and deletion of blogs across services.
-   **Discord Bot Integration**: Effortless management through Discord commands.
-   **Data Versatility**: Store and manage additional data types beyond blogs.
-   **Service Synchronization**: Ensures consistency and accessibility across Purrquinox platforms.

## Installation

To set up and run **Huimang**, follow these steps:

### Prerequisites

1. **Install PostgreSQL (psql)**  
   Huimang requires PostgreSQL for database management. To install PostgreSQL:

    - **Linux**:
        ```
        sudo apt update
        sudo apt install postgresql postgresql-contrib
        ```
    - **macOS** (using Homebrew):
        ```
        brew install postgresql
        brew services start postgresql
        ```
    - **Windows**:  
      Download and install PostgreSQL from the [official site](https://www.postgresql.org/download/).

    After installation, create a new database and user:

    ```
    sudo -u postgres psql CREATE DATABASE huimang; CREATE USER huimang_user WITH PASSWORD 'secure_password'; GRANT ALL PRIVILEGES ON DATABASE huimang TO huimang_user;
    ```

2. **Install Node.js**  
   Ensure you have Node.js installed. You can download it from [Node.js Official Website](https://nodejs.org).

### Environment Configuration

1. Create a `.env` file in the project root directory.
2. Add your PostgreSQL connection URL in the following format:

```
DATABASE_URL=postgresql://huimang_user:secure_password@localhost:5432/huimang
```

Replace `huimang_user`, `secure_password`, `localhost`, and `5432` with your actual PostgreSQL username, password, host, and port, if different.

### Install Dependencies and Initialize

Run the following command to install all required dependencies, set up the database schema, and add seed data:

```
npm install
```

### Start the Application

Finally, start the API and Discord bot with:

```
npm start
```

## Contributing

We encourage community involvement! To contribute:

1. Fork the repository.
2. Create a branch for your feature or fix.
3. Submit a pull request for review.

## License

Huimang is licensed under the AGPL-3.0 License. See the [LICENSE](LICENSE) file for more information.

## Acknowledgments

Huimang is a key part of **Purrquinox**, designed to enhance collaboration and streamline content management. Thank you for supporting our mission!
