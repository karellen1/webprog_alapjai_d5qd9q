FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY . .
RUN dotnet restore "src/NotesApp.API/NotesApp.API.csproj"
RUN dotnet publish "src/NotesApp.API/NotesApp.API.csproj" -c Release -r linux-musl-x64 --self-contained true -o /app/publish /p:UseAppHost=true

FROM alpine:3.20 AS final
WORKDIR /app

RUN apk add --no-cache libstdc++ libgcc icu-libs ca-certificates krb5-libs

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

COPY --from=build /app/publish .
ENTRYPOINT ["./NotesApp.API"]
