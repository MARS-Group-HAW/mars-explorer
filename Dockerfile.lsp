FROM debian:stretch-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        curl \
        libc6 \
        libgcc1 \
        libgssapi-krb5-2 \
        libicu57 \
        liblttng-ust0 \
        libssl1.0.2 \
        libstdc++6 \
        zlib1g \
        ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Omnisharp
ENV OMNISHARP_VERSION 1.34.9
ENV DOTNET_SDK_VERSION 3.1.100

RUN curl -L -o omnisharp.tar.gz https://github.com/OmniSharp/omnisharp-roslyn/releases/download/v$OMNISHARP_VERSION/omnisharp.http-linux-x64.tar.gz
RUN curl -L -o dotnet.tar.gz https://download.visualstudio.microsoft.com/download/pr/d731f991-8e68-4c7c-8ea0-fad5605b077a/49497b5420eecbd905158d86d738af64/dotnet-sdk-$DOTNET_SDK_VERSION-linux-x64.tar.gz
RUN mkdir -p /opt/dotnet && tar -zxf dotnet.tar.gz -C /opt/dotnet
RUN mkdir -p /opt/omnisharp && tar -zxf omnisharp.tar.gz -C /opt/omnisharp

# RUN ln -s /opt/dotnet/dotnet /usr/bin/dotnet
ENV DOTNET_RUNNING_IN_CONTAINER=true \
  NUGET_XMLDOC_MODE=skip \
  DOTNET_USE_POLLING_FILE_WATCHER=true
# Trigger first run experience by running arbitrary cmd to populate local package cache
# RUN dotnet help

WORKDIR /opt/omnisharp/
EXPOSE 2000
# Entrypoint
CMD ["./run", "--languageserver", "--interface 0.0.0.0"]
