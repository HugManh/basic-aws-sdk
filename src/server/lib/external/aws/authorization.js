#!/usr/bin/env node
import chalk from "chalk";
import inquirer from "inquirer";
import { createSpinner } from "nanospinner";
import clipboardy from "clipboardy";
import copy from "clipboard-copy";

// import gradient from 'gradient-string';
// import chalkAnimation from 'chalk-animation';
// import figlet from 'figlet';
import crypto from "crypto";
import url from "url";
import dotenv from "dotenv";
dotenv.config();

const methods = [
  "GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "CONNECT",
]

const access_key = Buffer.from(
  process.env.AWS_ACCESS_KEY_ID,
  "utf-8"
).toString();
const secret_key = Buffer.from(
  process.env.AWS_SECRET_ACCESS_KEY,
  "utf-8"
).toString();

const now = new Date();
const date = now.toUTCString();
const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

function authorizeV2(uri) {
  var q = url.parse(uri, true);
  const method = methods[1];
  const content_md5 = "";
  const content_type = "";
  const canonicalized_amz_headers = "";
  const canonicalized_resource = q.pathname;

  //   console.log(
  //     "method: " +
  //       method +
  //       "\n" +
  //       "content_md5: " +
  //       content_md5 +
  //       "\n" +
  //       "content_type: " +
  //       content_type +
  //       "\n" +
  //       "canonicalized_amz_headers:" +
  //       canonicalized_amz_headers +
  //       "\n" +
  //       "canonicalized_resource: " +
  //       canonicalized_resource
  //   );

  const string_to_sign =
    method +
    "\n" +
    content_md5 +
    "\n" +
    content_type +
    "\n" +
    date +
    "\n" +
    canonicalized_amz_headers +
    canonicalized_resource;

  const hmac_sha1 = crypto
    .createHmac("sha1", secret_key)
    .update(string_to_sign)
    .digest();
  const signature = hmac_sha1.toString("base64");

  const authorization = "AWS" + " " + access_key + ":" + signature;

  console.log("Date: ", date);
  console.log("Authorization: ", authorization);
}

// async function copy() {
//   await clipboardy.write("butter");
//   const text = await clipboardy.read();
//   console.log("coped!");
// }

async function choicesVersion() {
  const answers = await inquirer.prompt([
    {
      name: "url",
      type: "input",
      message: "Enter the url",
      default() {
        return "https://example.com/version";
      },
    },
    {
      name: "version",
      type: "list",
      message: "Enter the version number",
      choices: ["v2", "v4"],
    },
  ]);

  return handleAnswer(answers.url, answers.version);
}

async function handleAnswer(url, version) {
  const spinner = createSpinner("Checking answer...").start();
  await sleep();

  switch (version) {
    case "v2":
      spinner.success({ test: "Nice work" });
      button.addEventListener("click", function () {
        copy("This is some cool text");
      });
      //   authorizeV2(url);
      break;
    case "v4":
      process.exit(1);
    default:
      spinner.error({ test: "Game over" });
      process.exit(1);
  }
}

await choicesVersion();
