# Image avec le SDK .NET pour compiler le projet


FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src


COPY ["CesiZen.API/CesiZen.API.csproj", "CesiZen.API/"]
COPY ["CesiZen.Domain/CesiZen.Domain.csproj", "CesiZen.Domain/"]
COPY ["CesiZen.Infrastructure/CesiZen.Infrastructure.csproj", "CesiZen.Infrastructure/"]

RUN dotnet restore "CesiZen.API/CesiZen.API.csproj"

COPY CesiZen.API/ CesiZen.API/
COPY CesiZen.Domain/ CesiZen.Domain/
COPY CesiZen.Infrastructure/ CesiZen.Infrastructure/

WORKDIR /src/CesiZen.API
RUN dotnet publish "CesiZen.API.csproj" \
    -c Release \
    -o /app/publish \
    /p:UseAppHost=false


# Image ASP.NET

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

# Créer un utilisateur non-root
RUN groupadd -r cesizen && useradd -r -g cesizen cesizen

COPY --from=build --chown=cesizen:cesizen /app/publish .

# Variables d'environnement par défaut
ENV ASPNETCORE_HTTP_PORTS=8080
ENV ASPNETCORE_ENVIRONMENT=Production
ENV DOTNET_RUNNING_IN_CONTAINER=true
ENV DOTNET_NOLOGO=true

# Basculer sur l'utilisateur non-root
USER cesizen

# Port exposé par le conteneur
EXPOSE 8080

ENTRYPOINT ["dotnet", "CesiZen.API.dll"]