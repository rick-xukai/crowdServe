const addStyleToDom = (dom, style) => {
  const styleAttribute = dom.getAttribute('style');

  if (styleAttribute === undefined) {
    dom.setAttribute('style', style)
  } else {
    dom.setAttribute('style', `${styleAttribute} ${style}`)
  }

  return dom;
}

const handleCssContextToObject = cssString => {
  let cssContext = replaceFormatCharacter(cssString);
  let object = {};
  let indexStart = 0;

  while (cssContext.length > 0) {
    let firstRuleEnd = cssContext.indexOf('}') + 1;
    let firstRule = cssContext.substring(indexStart, firstRuleEnd);

    let [firstRuleKey, firstRuleValue] = firstRule.split('{');
    firstRuleKey = firstRuleKey.trim();
    firstRuleValue =
      firstRuleValue
        .split(';')
        .map(item => item.trim())
        .join(';')
        .slice(0, -1);
    object[firstRuleKey] = `${firstRuleValue.slice(0, -1)};`;

    cssContext = cssContext.substring(firstRuleEnd);
  }
  
  return object;
}

const replaceFormatCharacter = string => {
  return string.replace(/[\n\r\t]/g, '');
}

module.exports = {
  addStyleToDom,
  handleCssContextToObject,
};
