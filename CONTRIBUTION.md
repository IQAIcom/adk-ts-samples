# 🤝 Contributing Guide for ADK-TS Samples

First of all, thank you for taking the time to contribute! 🎉

This guide will help you understand how to contribute to the ADK-TS Samples repository effectively. Whether you're reporting bugs in existing samples, suggesting new sample projects, or contributing your own agent implementations, this document will provide you with the necessary steps and guidelines.

<span id="table-of-contents"></span>

## 🗂️ Table of Contents

- [Reporting Issues](#reporting-issues)
- [Requesting New Samples](#requesting-new-samples)
- [Understanding the Project](#understanding-the-project)
  - [Prerequisites](#prerequisites)
  - [Repository Structure](#repository-structure)
- [Contributing to the Project](#contributing-to-the-project)
  - [Adding a New Example](#adding-a-new-sample)
  - [Improving Existing Samples](#improving-existing-samples)
  - [Cloning the Repository](#cloning-the-repository)
  - [Making Your Changes](#making-your-changes)
  - [Opening a Pull Request](#opening-a-pull-request)
- [Example Guidelines](#sample-guidelines)
- [License](#license)

The following is a set of guidelines for contributing to ADK-TS Samples. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

Before contributing, we encourage you to read our [Code of Conduct](CODE_OF_CONDUCT.md).

<span id="reporting-issues"></span>

## 💣 Reporting Issues

This section guides you through submitting a bug report for existing samples. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.

Before creating a new issue, **[check existing issues](https://github.com/IQAIcom/adk-ts-samples/issues)** to see if the report exists. If it does, go through the discussion thread and leave a comment instead of opening a new one.

If you find a **Closed** issue that is the same as what you are experiencing, open a new issue and include a link to the original issue in the body of your new one.

When reporting issues with samples, be sure to include:

- **Which sample project** you're working with
- **Clear title and description** of the issue
- **Exact steps to reproduce** the bug
- **Your environment details** (Node.js version, OS, package manager)
- **Expected vs. actual behavior**
- **Error logs or screenshots** if applicable

[🔝 Back to top](#table-of-contents)

<span id="requesting-new-samples"></span>

## 🛠 Requesting New Samples

We track new sample requests as GitHub issues using the "Sample Request" template.

Before submitting a new sample request, **[check existing issues](https://github.com/IQAIcom/adk-ts-samples/issues)** to see if a similar request already exists.

A good sample request should include:

- **Clear description** of the agent or use case you'd like to see
- **Project type** (Web app, CLI tool, API service, etc.)
- **Specific ADK-TS features** you want demonstrated
- **Target complexity level** (Beginner, Intermediate, Advanced)
- **Industry or domain focus** if applicable

[🔝 Back to top](#table-of-contents)

<span id="understanding-the-project"></span>

## ✨ Understanding the Project

Before contributing to the project, you need to understand the repository structure and how samples are organized.

<span id="prerequisites"></span>

### Prerequisites

To contribute samples to this repository, you should have:

- **Node.js 18+** installed
- **npm, yarn, or pnpm** as your package manager
- **TypeScript knowledge** and familiarity with ADK-TS
- **ADK-TS installed** - see the [ADK-TS Installation Guide](https://adk.iqai.com/docs/framework/get-started/installation)

<span id="repository-structure"></span>

### Repository Structure

This repository is organized as follows:

```text
├── agents/                    # Sample agent projects
│   ├── README.md             # Setup and testing guide
│   └── [sample-projects]/    # Individual example projects
├── .github/                  # GitHub templates and workflows
└── README.md               # Main repository README
```

Each sample project should be self-contained with its own:

- README with setup instructions
- package.json with dependencies
- Source code demonstrating ADK-TS usage
- Example configuration files

[🔝 Back to top](#table-of-contents)

<span id="contributing-to-the-project"></span>

## 📝 Contributing to the Project

<span id="adding-a-new-sample"></span>

### Adding a New Example

When adding a new sample agent or project:

1. **Create a new folder** in the `agents/` directory with a descriptive name
2. **Include a comprehensive README** explaining:
   - What the sample demonstrates
   - Setup and installation steps
   - How to run the sample
   - Key ADK-TS features showcased
3. **Add your source code** with clear comments and documentation
4. **Update the main README** table with your sample's details
5. **Test thoroughly** to ensure everything works as expected

<span id="improving-existing-samples"></span>

### Improving Existing Samples

You can contribute by:

- **Fixing bugs** in existing samples
- **Improving documentation** and setup instructions
- **Adding new features** to demonstrate additional ADK-TS capabilities
- **Optimizing code** for better performance or readability
- **Updating dependencies** to latest versions

<span id="cloning-the-repository"></span>

### Cloning the Repository

#### 1. Fork the repo

Click the fork button at the top right of the [project home page](https://github.com/IQAIcom/adk-ts-samples) to create a copy of this repo in your account.

#### 2. Clone the forked repo

On your forked repo, click the green button that says `Code`. Copy the HTTPS link and run:

```bash
git clone https://github.com/<your-username>/adk-ts-samples.git
cd adk-ts-samples
```

Replace `<your-username>` with your GitHub username.

#### 3. Set up the project

Navigate to the agents directory to explore existing samples:

```bash
cd agents
# Follow the setup instructions in agents/README.md
```

[🔝 Back to top](#table-of-contents)

<span id="making-your-changes"></span>

### Making Your Changes

#### 1. Create a new branch

Create a new branch from the `main` branch. Your branch name should be descriptive:

- For New Samples: `feat/add-<sample-name>`
- For Bug Fixes: `fix/<sample-name>-<issue-description>`
- For Documentation: `docs/<brief-description>`

```bash
git checkout -b <your-branch-name>
```

#### 2. Develop your sample

- Create your sample in the appropriate directory
- Write clear, well-commented code
- Include comprehensive documentation
- Test your sample thoroughly
- Update the main README table if adding a new sample

#### 3. Commit your changes

Follow [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) specification:

```bash
git add .
git commit -m "feat: add customer service chatbot sample"
```

#### 4. Push your changes

```bash
git push origin your-branch-name
```

[🔝 Back to top](#table-of-contents)

<span id="opening-a-pull-request"></span>

### Opening a Pull Request

1. **Create a new Pull Request** on GitHub
2. **Use the PR template** and fill in all required information
3. **Ensure your sample runs successfully** and all documentation is clear
4. **Update the samples table** in the main README if adding a new project
5. **Wait for review** - maintainers will review and provide feedback

[🔝 Back to top](#table-of-contents)

<span id="sample-guidelines"></span>

## 📋 Example Guidelines

When creating samples, please follow these guidelines:

### Code Quality

- Write clean, readable, and well-commented code
- Use TypeScript best practices
- Follow consistent naming conventions
- Include error handling where appropriate

### Documentation

- Provide clear setup instructions
- Explain what ADK-TS features are demonstrated
- Include usage samples and expected output
- Document any external dependencies or API keys needed

### Structure

- Keep samples self-contained
- Use meaningful file and folder names
- Include a package.json with all necessary dependencies
- Provide sample configuration files

### Testing

- Test your sample on a fresh environment
- Verify all setup instructions work correctly
- Ensure the sample runs without errors
- Test with different input scenarios when applicable

[🔝 Back to top](#table-of-contents)

<span id="license"></span>

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

[🔝 Back to top](#table-of-contents)
