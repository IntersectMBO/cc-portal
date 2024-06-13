# How to Create .httpasswd File for User Authentication on Nginx

## Introduction

In Nginx, you can enhance the security of your web server by implementing basic HTTP authentication. This involves creating a `.httpasswd` file to store usernames and encrypted passwords. This guide will walk you through the process of creating and managing a `.httpasswd` file for user authentication on Nginx.

## Prerequisites

- Access to a terminal or command line interface

## Step 1: Install Apache Utilities (htpasswd)

To create the `.httpasswd` file, we'll use the `htpasswd` utility which is part of the Apache HTTP server package. If you don't have it installed, you can typically install it using your system's package manager. For example, on Ubuntu or Debian-based systems, you can install it with the following command:

```bash
sudo apt-get update
sudo apt-get install apache2-utils
```

## Step 2: Create the .httpasswd File

Once you have htpasswd installed, you can create the .httpasswd file by running the following command:

```bash
htpasswd -c /path/to/.httpasswd username
```

Replace /path/to/.httpasswd with the desired path and filename for your .httpasswd file, and replace username with the username you want to create. You will be prompted to enter and confirm the password for the user.

## NOTICE

For example.httpasswd file, credentials are following:

- username: BEdev24
- password: bedev.bloxico24
