/**
 * Developer Utility Script
 * 
 * This script is used to extract raw SVG strings from react-icons components.
 * Since the Decky plugin UI manipulates the DOM directly (using raw HTML),
 * we cannot easily mount full React components into the capsule.
 * 
 * Run this script to print the SVG HTML, then copy-paste it into src/utils/badge.ts.
 */
const { renderToString } = require('react-dom/server');
const React = require('react');

const { SiUbisoft, SiEpicgames, SiGogdotcom, SiAmazon, SiRockstargames } = require('react-icons/si');
const { FaXbox } = require('react-icons/fa');
const { TbBrandElectronicArts } = require('react-icons/tb');

console.log('SiUbisoft:');
console.log(renderToString(React.createElement(SiUbisoft)));

console.log('\nFaXbox:');
console.log(renderToString(React.createElement(FaXbox)));

console.log('\nSiEpicgames:');
console.log(renderToString(React.createElement(SiEpicgames)));

console.log('\nSiGogdotcom:');
console.log(renderToString(React.createElement(SiGogdotcom)));

console.log('\nSiAmazon:');
console.log(renderToString(React.createElement(SiAmazon)));

console.log('\nSiRockstargames:');
console.log(renderToString(React.createElement(SiRockstargames)));

console.log('\nTbBrandElectronicArts:');
console.log(renderToString(React.createElement(TbBrandElectronicArts)));
