import { html } from '@polymer/lit-element';

const feedStyle = html`
        <style>
            :host {
                display: block;
                font-size: smaller;
                --paper-padding: 16px;
            }
            span {
                padding-left: 7px;
            }
            card-element{
                padding-bottom: var(--paper-padding);
                padding-left: 4%;
                padding-right: 4%;
            }
            paper-checkbox{
                float: left;
                margin-top: 27px;
                margin-right: 20px;
                margin-left: 15px;
                margin-bottom: 55px;
                --paper-checkbox-size: 23px;
            }   
            mwc-fab{
                position: fixed;
                right: 15%;
                bottom: 10%;
                /*--mwc-fab-background: #F44336;*/
                
            } 
            mwc-fab:focus {
                /*background: #F44336;*/
            } 
            .paper-list{
                box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.14),
                        0 1px 8px 0 rgba(0, 0, 0, 0.12),
                        0 3px 3px -2px rgba(0, 0, 0, 0.4);  
                border-radius: 3px;
            }
            .paper-list card-element:last-child hr{
                display: none;
            }
            .paper-list card-element:first-child{
                padding-top: var(--paper-padding);
            }
            :host hr{
                background-color: #efefef;
                height: 1px;
                border: none;
                margin: 0;
                margin-top: 0.5em;
            }

            @media (max-width: 650px) {
                :host {
                    margin-top: 0;
                }
                mwc-fab{
                    right: 7%;
                    bottom: 7%;
                }
            }
        </style>
    `;

export { feedStyle };