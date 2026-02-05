# Email AI SaaS
A smart email assistant powered by AI for generation and analysis.

Welcome to **Email AI SaaS**! We're building a friendly and powerful tool to help you manage your emails with the power of Artificial Intelligence. Whether you need to draft the perfect message or analyze incoming threads, we've got you covered.

## ✨ Features

- **AI Email Tools**: Generate professional emails and analyze conversations with advanced AI models.
- **Modern Stack**: Built with performance and scalability in mind using Next.js and NestJS.

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TailwindCSS
- **Backend**: NestJS 11, Prisma, PostgreSQL (Planned)
- **AI Integration**: DeepSeek API (or similar)

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/summitlee888/email-ai-saas.git
    cd email-ai-saas
    ```

2.  **Install Backend Dependencies**
    ```bash
    cd backend
    npm install
    ```

3.  **Install Frontend Dependencies**
    ```bash
    cd ../frontend
    npm install
    ```

4.  **Run the Application**
    - Start Backend: `cd backend && npm run start:dev`
    - Start Frontend: `cd frontend && npm run dev`

### 🔑 Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file in the `backend` directory.

| Variable | Description |
| :--- | :--- |
| `DATABASE_URL` | Connection string for your database (e.g., PostgreSQL) |
| `JWT_SECRET` | Secret key for JWT authentication |
| `DEEPSEEK_API_KEY` | API key for the AI service |

## 🗺️ Roadmap

- [ ] Support for more AI models
- [ ] User Dashboard improvements
- [ ] Email template management

## 🤝 Contributing

We welcome contributions! If you have ideas or find bugs, please feel free to open an issue or submit a pull request.

1.  Fork the repository
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 💬 Support

If you encounter any issues or have questions, please [open an issue](https://github.com/summitlee888/email-ai-saas/issues) on GitHub.

## 🙏 Acknowledgments

- Thanks to the [NestJS](https://nestjs.com/) and [Next.js](https://nextjs.org/) communities for their amazing frameworks.
- Special thanks to all our contributors.

## 📧 Contact

Created by [summitlee888](https://github.com/summitlee888) - feel free to contact me!
