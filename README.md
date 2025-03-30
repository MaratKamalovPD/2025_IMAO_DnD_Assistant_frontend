# 2025_IMAO_DnD_Assistant_frontend

### Установка node_modules

```
npm install
```

### Запуск dev сервера

```
npm run dev
```

### Запуск линтера

```
npm run lint
```

### Запуск сборки

```
npm run build
```

## After build 
```
sudo mkdir -p /var/www/encounterium
sudo chown -R $USER:$USER /var/www/encounterium
rsync -avz ./dist/ /var/www/encounterium/dist/

sudo mkdir -p /var/www/encounterium/static/src/shared/assets/images
sudo chown -R $USER:$USER /var/www/encounterium/static
rsync -avz ./src/shared/assets/images/ /var/www/encounterium/static/src/shared/assets/images/

```
