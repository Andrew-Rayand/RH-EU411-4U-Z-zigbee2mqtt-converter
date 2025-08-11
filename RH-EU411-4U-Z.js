// Данный конвертер предназначен для блока розеток Tuya RH-EU411-4U-Z - нужно ввести только IEEE-адрес
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const reporting = require('zigbee-herdsman-converters/lib/reporting');
const fz = require('zigbee-herdsman-converters/converters/fromZigbee');
const tz = require('zigbee-herdsman-converters/converters/toZigbee');

const e = exposes.presets;

const definition = {
    fingerprint: [
        {
            ieeeAddr: '0xa0c00000d0e0c000',   // уникальный адрес твоего устройства
            modelID: 'TS011F',
            manufacturerName: '_TZ3000_pl5v1yyy'
        }
    ],
    model: 'E220-KR4N0Z0-HA',
    vendor: 'Tuya',
    description: '4 AC outlets + 4 USB ports with power monitoring (separate control fix)',

    fromZigbee: [fz.on_off, fz.electrical_measurement],
    toZigbee: [tz.on_off],

    exposes: [
        e.switch().withEndpoint('l1'),
        e.switch().withEndpoint('l2'),
        e.switch().withEndpoint('l3'),
        e.switch().withEndpoint('l4'),
        e.switch().withEndpoint('l5').withDescription('USB ports'),
        e.power(),
        e.current(),
        e.voltage(),
    ],

    meta: {
        multiEndpoint: true,
        tuya_do_not_publish_state: true, // чтобы команды не перезаписывались
    },

    endpoint: (device) => ({
        'l1': 1,
        'l2': 2,
        'l3': 3,
        'l4': 4,
        'l5': 5,
    }),

    configure: async (device, coordinatorEndpoint, logger) => {
        // Включаем энергомониторинг и управление для первой розетки
        const endpoint1 = device.getEndpoint(1);
        await reporting.bind(endpoint1, coordinatorEndpoint, ['genOnOff', 'haElectricalMeasurement']);
        await reporting.onOff(endpoint1);
        await reporting.rmsVoltage(endpoint1, {min: 10, max: 3600, change: 5});
        await reporting.rmsCurrent(endpoint1, {min: 10, max: 3600, change: 10});
        await reporting.activePower(endpoint1, {min: 10, max: 3600, change: 2});

        // Настройка управления для остальных розеток
        for (let i = 2; i <= 5; i++) {
            const endpoint = device.getEndpoint(i);
            if (endpoint) {
                await reporting.bind(endpoint, coordinatorEndpoint, ['genOnOff']);
                await reporting.onOff(endpoint);
            }
        }
    },
};

module.exports = definition;
