/*!
 * error message
 *
 * Creates a HashMap used to Map the Hex values of errorMessage to their textual
 * description.
 * 
 * @author Weichao Gong
 * University of Southampton
 */

/**
 * Module depedencies
 * @private
 */
var HashMap = require('hashmap');

/**
 * Create HashMap and initialise.
 */
var errorMessage = new HashMap();

errorMessage.set('0x9000','SW_NO_ERROR');
errorMessage.set('0x9000', 'SW_NO_ERROR');
errorMessage.set('0x6100', 'SW_BYTES_REMAINING_00');
errorMessage.set('0x6700', 'SW_WRONG_LENGTH');
errorMessage.set('0x6300', 'SW_VERIFICATION_FAILED');
errorMessage.set('0x6301', 'SW_PIN_VERIFICATION_REQUIRED');
errorMessage.set('0x6982', 'SW_SECURITY_STATUS_NOT_SATISFIED');
errorMessage.set('0x6983', 'SW_FILE_INVALID');
errorMessage.set('0x6984', 'SW_DATA_INVALID');
errorMessage.set('0x6985', 'SW_CONDITIONS_NOT_SATISFIED');
errorMessage.set('0x6986', 'SW_COMMAND_NOT_ALLOWED');
errorMessage.set('0x6999', 'SW_APPLET_SELECT_FAILED');
errorMessage.set('0x6a80', 'SW_WRONG_DATA');
errorMessage.set('0x6a81', 'SW_FUNC_NOT_SUPPORTED');
errorMessage.set('0x6a82', 'SW_FILE_NOT_FOUND');
errorMessage.set('0x6a83', 'SW_RECORD_NOT_FOUND');
errorMessage.set('0x6a86', 'SW_INCORRECT_P1P2');
errorMessage.set('0x6b00', 'SW_WRONG_P1P2');
errorMessage.set('0x6c00', 'SW_CORRECT_LENGTH_00');
errorMessage.set('0x6d00', 'SW_INS_NOT_SUPPORTED');
errorMessage.set('0x6e00', 'SW_CLA_NOT_SUPPORTED');
errorMessage.set('0x6f00', 'SW_UNKNOWN');
errorMessage.set('0x6F00', 'SW_UNKNOWN');
errorMessage.set('0x6a84', 'SW_FILE_FULL');
errorMessage.set('0x6881', 'SW_LOGICAL_CHANNEL_NOT_SUPPORTED');
errorMessage.set('0x6882', 'SW_SECURE_MESSAGING_NOT_SUPPORTED');
errorMessage.set('0x6200', 'SW_WARNING_STATE_UNCHANGED');
errorMessage.set('0x6883', 'SW_LAST_COMMAND_EXPECTED');
errorMessage.set('0x6884', 'SW_COMMAND_CHAINING_NOT_SUPPORTED');
errorMessage.set('0xA4', 'INS_SELECT');
errorMessage.set('0x82', 'INS_EXTERNAL_AUTHENTICATE');

errorMessage.set('0','OFFSET_CLA');
errorMessage.set('1', 'OFFSET_INS');
errorMessage.set('2', 'OFFSET_P1');
errorMessage.set('3', 'OFFSET_P2');
errorMessage.set('4', 'OFFSET_LC');
errorMessage.set('5', 'OFFSET_CDATA');
errorMessage.set('7', 'OFFSET_EXT_CDATA');
errorMessage.set('0', 'CLA_errorMessage');

/**
 * Export HashMap
 */

module.exports = errorMessage;