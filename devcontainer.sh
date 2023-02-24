#!/bin/bash
set +e  # Continue on errors

export NODE_ENV=development
if [ -f "package.json" ]; then
   echo "Installing NPM Dependencies"
   npm install --legacy-peer-deps
fi

COLOR_BLUE="\033[0;94m"
COLOR_GREEN="\033[0;92m"
COLOR_RESET="\033[0m"

# Print useful output for user
echo -e "${COLOR_BLUE}
Welcome to your development container!
This is how you can work with it:
- Files will be synchronized between your local machine and this container
- You can run any commands that you run generally to manage the application.
"

# Set terminal prompt
export PS1="\[${COLOR_BLUE}\]devspace\[${COLOR_RESET}\] ./\W \[${COLOR_BLUE}\]\\$\[${COLOR_RESET}\] "
if [ -z "$BASH" ]; then export PS1="$ "; fi

# Include project's bin/ folder in PATH
export PATH="./bin:$PATH"

# Open shell
bash --norc
