/* Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* global expect, describe, beforeEach, it */

import timeAgo from "../../warehouse/static/js/warehouse/utils/timeago";
import {delay} from "./utils";

describe("time ago util", () => {
  beforeEach(() => {
    document.documentElement.lang = "en";

    fetch.resetMocks();
  });

  it("shows 'just now' for a very recent time'", async () => {
    document.body.innerHTML = `
    <time id="element" datetime="${new Date().toISOString()}"></time>
    `;

    fetch.mockResponses(
      [JSON.stringify({"msg": "Just now"}), {status: 200}],
    );

    timeAgo();

    await delay(25);

    const element = document.getElementById("element");
    expect(element.innerText).toEqual("Just now");

    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual("/translation/?s=Just+now");
  });

  it("shows 'About 5 hours ago' for such a time'", async () => {
    const date = new Date();
    date.setHours(date.getHours() - 5);

    document.body.innerHTML = `
    <time id="element" datetime="${date.toISOString()}"></time>
    `;

    fetch.mockResponses(
      [JSON.stringify({"msg": "About 5 hours ago"}), {status: 200}],
    );

    timeAgo();

    await delay(25);

    const element = document.getElementById("element");
    expect(element.innerText).toEqual("About 5 hours ago");

    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual("/translation/?s=About+an+hour+ago&p=About+%24%7BnumHours%7D+hours+ago&n=5&numHours=5");
  });

  it("shows 'About 36 minutes ago' for such a time'", async () => {
    const date = new Date();
    date.setMinutes(date.getMinutes() - 36);

    document.body.innerHTML = `
    <time id="element" datetime="${date.toISOString()}"></time>
    `;

    fetch.mockResponses(
      [JSON.stringify({"msg": "About 36 minutes ago"}), {status: 200}],
    );

    timeAgo();

    await delay(25);

    const element = document.getElementById("element");
    expect(element.innerText).toEqual("About 36 minutes ago");

    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual("/translation/?s=About+a+minute+ago&p=About+%24%7BnumMinutes%7D+minutes+ago&n=36&numMinutes=36");
  });

  it("shows provided text for Yesterday'", async () => {
    const date = new Date();
    date.setHours(date.getHours() - 24);

    document.body.innerHTML = `
    <time id="element" datetime="${date.toISOString()}"></time>
    `;

    fetch.mockResponses(
      [JSON.stringify({"msg": "one day ago"}), {status: 200}],
    );

    timeAgo();

    await delay(25);

    const element = document.getElementById("element");
    expect(element.innerText).toEqual("one day ago");

    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual("/translation/?s=Yesterday&p=About+%24%7BnumDays%7D+days+ago&n=1&numDays=1");
  });

  it("makes no fetch call when not isBeforeCutoff", async () => {
    document.body.innerHTML = `
    <time id="element" datetime="2019-09-20T19:06:58+0000">existing text</time>
    `;

    timeAgo();

    await delay(25);

    const element = document.getElementById("element");
    expect(element.textContent).toEqual("existing text");

    expect(fetch.mock.calls.length).toEqual(0);
  });
});