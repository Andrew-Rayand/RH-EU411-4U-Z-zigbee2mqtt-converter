Данный внешний конвертер предназначен для корректной работы устройства RH-EU411-4U-Z от Tuya с моделью TS011F производителем _TZ3000_pl5v1yyy в Zigbee2MQTT.

Установка:
1. Установить дополнение File Editor в Home Assistant
2. В конфигурацию дополнения Zigbee2MQTT добавить строки:
<code>
external_converters:
  - RH-EU411-4U-Z.js
</code>

3. Открыть дополнение File Editor и создать папку external_converters в каталоге:
/homeassistant/zigbee2mqtt/
4. Переместить скрипт RH-EU411-4U-Z.js в каталог: /homeassistant/zigbee2mqtt/external_converters/
5. В файле RH-EU411-4U-Z.js заменить на свой IEEE адрес блока розеток.
6. Перезагрузить дополнение Zigbee2MQTT.

Проверено, работает корректно на версии Zigbee2MQTT: 2.6.0-1
