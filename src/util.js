//foldu
export const includes = (array, item, func) => array.reduce((acc, otherItem) => acc || (func(otherItem) === func(item)), false);

export const enumerate = arr => Array.from(arr.entries());

//quick eeaasy selector
export const $$ = (context, nodeName) => context.shadowRoot.querySelector(nodeName);