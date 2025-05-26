# Adjust DOTNET_OS_VERSION as desired
ARG DOTNET_OS_VERSION="-alpine"
ARG DOTNET_SDK_VERSION=8.0

FROM mcr.microsoft.com/dotnet/sdk:${DOTNET_SDK_VERSION}${DOTNET_OS_VERSION} AS build
WORKDIR /src

# copy csproj and sln files to restore dependencies
COPY *.sln .
COPY musivis-api/*.csproj ./musivis-api/
# If there are other projects in subdirectories (e.g., class libraries) that the API project depends on,
# they should also be copied here in a similar fashion. For now, assuming only the main API project.
# Example for a shared library: COPY SharedLibrary/SharedLibrary.csproj ./SharedLibrary/
RUN dotnet restore musivis-api.sln

# copy everything else
COPY . ./
# build and publish a release
RUN dotnet publish -c Release -o /app musivis-api/Musivis.API.csproj

# final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:${DOTNET_SDK_VERSION}
ENV ASPNETCORE_URLS http://+:8080
ENV ASPNETCORE_ENVIRONMENT Production
EXPOSE 8080
WORKDIR /app
COPY --from=build /app .
ENTRYPOINT [ "dotnet", "Musivis.API.dll" ]
