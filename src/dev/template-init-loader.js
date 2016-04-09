"use strict";
import jsdom from "jsdom";
import ReactDomServer from "react-dom/server";
import components from "../app/components/main.js";

module.exports = function (content) {
    this.cacheable();

    let document = jsdom.jsdom(content),
        rcompRootNodes = document.querySelectorAll("[data-rcomp]");
    Array.prototype.forEach.call(
        rcompRootNodes,
        (item)=> {
            let rcomp = item.getAttribute('data-rcomp');
            if (rcomp) {
                 item.innerHTML = ReactDomServer.renderToString(components[rcomp]())
             }
        }
    );
    return jsdom.serializeDocument(document);
};
