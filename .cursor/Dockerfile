FROM node:20-bookworm

ENV DEBIAN_FRONTEND=noninteractive
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
ENV PIP_DISABLE_PIP_VERSION_CHECK=1

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    g++ \
    gcc \
    git \
    make \
    python3.11 \
    python3.11-dev \
    python3.11-venv \
    python3-pip \
  && rm -rf /var/lib/apt/lists/*

RUN python3.11 -m venv /opt/rht-nav-agents \
  && /opt/rht-nav-agents/bin/python -m pip install --upgrade pip setuptools wheel

ENV PATH="/opt/rht-nav-agents/bin:${PATH}"

# Cursor checks out the repo after the image is built, so dependency prewarming
# runs in the idempotent install step declared in environment.json.
