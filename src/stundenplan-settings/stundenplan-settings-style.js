import { html } from "@polymer/lit-element";

const settingsStyle = html`
        <style>
            :host {
                display: block;
                min-height: 335px;
            }
            select{
                font-size: 1.2em;
                width: 95%;
                background-color: #fff;
                border-top: none;
                border-right: none;
                border-left: none;
                margin-bottom: 1.5em;
            }
            }
            h2{
                -webkit-margin-before: 0.1em;
            }
            .switch{
                margin-bottom: 1em;
            }
            mwc-switch{
                margin-right: 0.6em;
            }
            #group {
                width: 80px;
                color: #FFF;
            }
            #gruppenbuchstabe {
                margin-bottom: 2em;
                width: 100px;
                display: block
            }
            mwc-button[raised] {
                <!-- background-color: var(--paper-grey-200); -->
                background-color: grey;
                margin-bottom: 14px;
            }
            mwc-button {
                margin-top: 16px;
                height: 1.5em;
            }
            #close-btn{
                float: right;
                margin-bottom: 10px;
            }
            #reset-btn{
                color: var(--paper-red-500);
            }

            @media(max-width: 410px) {
                #close-btn{
                    float: left;
                    margin-bottom: 16px;
                } 
            }
            @media(max-height: 580px){
                h2{
                    margin-bottom: 0;
                }
                #studiengang{
                height: 28px;
                margin-bottom: 36px;
                }
            }
        </style>
        `;

export { settingsStyle };