ARG VARIANT="14-buster"
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-${VARIANT}

COPY library-scripts/*.sh /tmp/library-scripts/
RUN apt-get update \
    && /bin/bash /tmp/library-scripts/common-debian.sh \
    # Clean up 
    && apt-get autoremove -y && apt-get clean -y && rm -rf /var/lib/apt/lists/* /tmp/library-scripts/

# Add additional packages 
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
        # Add utilties
        && sudo apt -y install --no-install-recommends software-properties-common apt-transport-https gnupg2 bash-completion \
        # Add key for GitHub CLI
        && sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-key C99B11DEB97541F0 \
        && sudo apt-add-repository https://cli.github.com/packages \
        && sudo apt update \
        # Install github cli
        && apt-get -y install --no-install-recommends gh \
        # Install useful libs
        && apt-get -y install --no-install-recommends httpie jq \
        && apt-get autoremove -y && apt-get clean -y && rm -rf /var/lib/apt/lists/* 

# Add bash completions
RUN echo 'source <(gh completion -s bash)' >> ~/.bashrc \
    && touch ~/.bash_profile \
    # Install useful oh-my-* shell plugins
    && sed -i.bak 's/^plugins=(\(.*\)/plugins=(debian docker docker-compose httpie node npm yarn vscode \1/' ~/.zshrc \
    && sed -i.bak 's/^plugins=(\(.*\)/plugins=(npm \1/' ~/.bashrc
