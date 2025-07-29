function Decode (fPort, bytes) {

  var funcEnumObj;
  var caseStr, tempStr;
  var dataObj = {
    payload: "",
    PN: 1,
    meterReading: "",
    meterType: "",
    measureMode: "",
    meterStatusAlarm: "",
  };
  var sizeEnumObj = {
    valveStatus: {
      0: "open valve",
      1: "close valve",
    },
    PN: { // L/P
      0: 0.5,
      1: 1,
      2: 10,
      3: 100,
      4: 1000,
    },
    meterType: {
      0: "water meter",
      1: "gas meter",
      2: "heat meter",
      3: "electric meter",
    },
    measureMode: {
      0: "double reed",
      1: "single reed",
      2: "double hall",
      3: "direct reading",
      4: "non-magnetic inductance",
      5: "non-magnetic coil",
      6: "three hall",
      7: "single Hall",
    },
    meterStatusAlarm: {
      1: {
        1: "measurement fault",
        3: "metering error",
        4: "battery removed",
        5: "Magnetic attack",
        6: "low voltage",
        7: "valve failure",
      },
      2: {},
    },
  };
  // the test data
  // bytes = [
  //   36, 25, 70, 22, 5, 245, 225, 3, 20, 2, 27, 0, 18, 2, 11, 0, 0, 144, 33,
  //   26, 0, 60, 51, 16, 0, 35, 0, 52
  // ];

  tempStr = bytes.map(function (byte) {
    return ("00" + (byte & 0xff).toString(16)).slice(-2);
  }).join("").toUpperCase();

  dataObj.payload = tempStr;

  funcEnumObj = {
    '01': placeholderLength(4),
    '02': placeholderLength(4),
    '03': placeholderLength(4),
    '04': placeholderLength(4),
    '05': placeholderLength(1),
    '06': placeholderLength(3),
    '07': placeholderLength(3),
    '08': placeholderLength(3),
    '09': placeholderLength(4),
    '0A': placeholderLength(4),
    '0B': placeholderLength(4),
    '0C': placeholderLength(4),
    '0D': placeholderLength(4),
    '0E': placeholderLength(4),
    '0F': placeholderLength(1),
    '10': placeholderLength(1),
    '13': placeholderLength(4),
    '15': placeholderLength(1),
    '16': placeholderLength(4),
    '17': placeholderLength(1),
    '19': placeholderLength(1),
    '1D': placeholderLength(3),
    '1F': placeholderLength(1),
    '20': placeholderLength(1),
    '21': placeholderLength(4),
    '23': placeholderLength(1),
    '24': placeholderLength(1),
    '25': placeholderLength(4),
    '26': placeholderLength(4),
    '27': placeholderLength(4),
    '28': placeholderLength(4),
    '29': placeholderLength(4),
    '2A': placeholderLength(4),
    '2B': placeholderLength(1),
    '2C': placeholderLength(2),
    '2D': placeholderLength(2),
    '2E': placeholderLength(1),
    '33': placeholderLength(2),
    '36': placeholderLength(2),
    '37': placeholderLength(1),
    '38': placeholderLength(4),
    '39': placeholderLength(2),
    '3A': placeholderLength(2),
    '3B': placeholderLength(2),
    '3C': placeholderLength(2),
    '3D': placeholderLength(2),
    '3E': placeholderLength(2),
    '1C': placeholderLength(6),
    '1E': placeholderLength(8),
    '34': placeholderLength(8),
    '35': placeholderLength(16),
    '0B': function (tempStr, sizeEnumObj, tempObjOne) {
      fc = 4 * 2 + 2;
      tempObjOne.meterReading =
        parseInt(tempStr.slice(2, fc), 16) * tempObjOne.PN;
      return [tempStr.slice(fc), tempObjOne]
    },
    '12': function (tempStr, sizeEnumObj, tempObjOne) {
      fc = 1 * 2 + 2;
      tempObjOne.measureMode =
        sizeEnumObj.measureMode[parseInt(tempStr.slice(2, fc), 16)];
      return [tempStr.slice(fc), tempObjOne]
    },
    '14': function (tempStr, sizeEnumObj, tempObjOne) {
      fc = 1 * 2 + 2;
      tempObjOne.PN =
        sizeEnumObj.PN[parseInt(tempStr.slice(2, fc), 16)];
      return [tempStr.slice(fc), tempObjOne]
    },
    '18': function (tempStr, sizeEnumObj, tempObjOne) {
      var devLengthTMP1 = parseInt(tempStr.slice(2, 4), 16);
      fc = (tempStr.length - 4 >= devLengthTMP1) ? devLengthTMP1 * 2 + 4 : tempStr.length;
      return [tempStr.slice(fc), tempObjOne]
    },
    '1A': function (tempStr, sizeEnumObj, tempObjOne) {
      fc = 2 * 2 + 2;
      tempObjOne.batteryVoltage =
        (parseInt(tempStr.slice(2, fc), 16) / 16.4).toPrecision(3);
      return [tempStr.slice(fc), tempObjOne]
    },
    '1B': function (tempStr, sizeEnumObj, tempObjOne) {
      fc = 1 * 2 + 2;
      tempObjOne.meterType =
        sizeEnumObj.meterType[parseInt(tempStr.slice(2, fc), 16)];
      return [tempStr.slice(fc), tempObjOne]
    },
    '22': function (tempStr, sizeEnumObj, tempObjOne) {
      var devLengthTMP2 = parseInt(tempStr.slice(2, fc), 16);
      fc = (tempStr.length - 4 >= devLengthTMP2) ? devLengthTMP2 * 2 + 4 : tempStr.length;

      return [tempStr.slice(fc), tempObjOne]
    },
    '33': function (tempStr, sizeEnumObj, tempObjOne) {
      fc = 2 * 2 + 2;
      var t1 = parseInt(tempStr.slice(2, 4), 16);
      tempObjOne.valveStatus = sizeEnumObj.valveStatus[(t1 & 0x04) >> 2];
      var t1ObjTMP1 = sizeEnumObj.meterStatusAlarm[1];
      var tmpBytes = [];
      if ((t1 & 0x02) >> 1) tmpBytes.push(t1ObjTMP1[1]);
      if ((t1 & 0x08) >> 3) tmpBytes.push(t1ObjTMP1[3]);
      if ((t1 & 0x10) >> 4) tmpBytes.push(t1ObjTMP1[4]);
      if ((t1 & 0x20) >> 5) tmpBytes.push(t1ObjTMP1[5]);
      if ((t1 & 0x40) >> 6) tmpBytes.push(t1ObjTMP1[6]);
      if ((t1 & 0x80) >> 7) tmpBytes.push(t1ObjTMP1[7]);
      tempObjOne.meterStatusAlarm = tmpBytes.join(";");
      return [tempStr.slice(fc), tempObjOne]
    },
    'default': function (tempStr, sizeEnumObj, tempObjOne) {
      return [tempStr.slice(tempStr.length), tempObjOne]
    },
  }

  caseStr = tempStr.slice(2, -2);
  while (caseStr.length) {
    var caseheaderStr = caseStr.slice(0, 2);
    caseheaderStr = (caseheaderStr in funcEnumObj) ? caseheaderStr : "default";
    caseObj = funcEnumObj[caseheaderStr](caseStr, sizeEnumObj, dataObj);
    caseStr = caseObj[0];
    dataObj = caseObj[1];
  }
  // console.log(dataObj);

  function placeholderLength (bitLength) {
    return function (tempStr, sizeEnumObj, tempObjOne) {
      return [tempStr.slice(bitLength * 2 + 2), tempObjOne];
    };
  };

  return dataObj;
}
