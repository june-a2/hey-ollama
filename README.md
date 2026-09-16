# hey-ollama | local code agent

a local ai coding agent for vs code, powered by ollama

## current status

this project is in early development. the first goal is to connect a locally running coding model to a custom vs code extension.

## planned features

- chat with a local ai model
- read the active file
- search project files
- explain and refactor code
- create and edit files
- run tests
- inspect errors
- request approval before making changes

## requirements

- vs code
- node.js
- git
- ollama
- a compatible local coding model

## local setup

install ollama from:

https://ollama.com/download/windows

download a coding model:

ollama pull qwen2.5-coder:7b

run the model:

ollama run qwen2.5-coder:7b

clone this repository:

git clone https://github.com/yourusername/local-code-agent.git
cd local-code-agent

install the project dependencies:

npm install

compile the extension:

npm run compile

press f5 in vs code to open the extension development host.

## privacy

the model is intended to run locally through ollama. project files should not be sent to an external ai provider unless additional integrations are added in the future.

never commit api keys, passwords, private project files, environment variables, or downloaded model files.

### project goals

this project is being built as a customisable local alternative for ai-assisted software development inside vs code
