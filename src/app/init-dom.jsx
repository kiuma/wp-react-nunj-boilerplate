import React from "react";
import components from "./components/main.js";
import ReactDom from 'react-dom';

export default function (root) {
    root = root || document;
    Array.prototype.forEach.call(
        root.querySelectorAll('[data-rcomp]'),
        (item)=> {
            let rcomp = item.getAttribute('data-rcomp');
            if (rcomp) {
                ReactDom.render(components[rcomp](), item);
            }
        }
    );

};