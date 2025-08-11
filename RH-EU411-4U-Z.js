// Данный конвертер предназначен для блока розеток Tuya RH-EU411-4U-Z нужно ввести только IEEE-адрес
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const reporting = require('zigbee-herdsman-converters/lib/reporting');
const fz = require('zigbee-herdsman-converters/converters/fromZigbee');
const tz = require('zigbee-herdsman-converters/converters/toZigbee');

const e = exposes.presets;

module.exports = {
    fingerprint: [
        {
            ieeeAddr: '0xa0c00000d0e0c000',  // конкретный IEEE-адрес устройства
            modelID: 'TS011F',
            manufacturerName: '_TZ3000_pl5v1yyy',
        }
    ],
    model: 'E220-KR4N0Z0-HA',
    vendor: 'TuYa',
    description: '4 AC outlets + 4 USB ports',
    fromZigbee: [fz.on_off],
    toZigbee: [tz.on_off],
    exposes: [
        e.switch().withEndpoint('l1'),
        e.switch().withEndpoint('l2'),
        e.switch().withEndpoint('l3'),
        e.switch().withEndpoint('l4'),
        e.switch().withEndpoint('l5'),
    ],
    meta: {
        multiEndpoint: true,
    },
    endpoint: (device) => {
        return {
            'l1': 1,
            'l2': 2,
            'l3': 3,
            'l4': 4,
            'l5': 5
        };
    },
    configure: async (device, coordinatorEndpoint, logger) => {
        for (let i = 1; i <= 5; i++) {
            const endpoint = device.getEndpoint(i);
            await reporting.bind(endpoint, coordinatorEndpoint, ['genOnOff']);
            await reporting.onOff(endpoint);
        }
    },
};
