/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/esim_zkp.json`.
 */
export type EsimZkp = {
  "address": "7szrUTgx4Ks3EkpC99uvyeaamccQbZ49dCwVmpvutYDt",
  "metadata": {
    "name": "esimZkp",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "delete",
      "discriminator": [
        165,
        204,
        60,
        98,
        134,
        15,
        83,
        134
      ],
      "accounts": [
        {
          "name": "esim",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "arg",
                "path": "phoneNumber"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "address",
          "type": "string"
        },
        {
          "name": "phoneNumber",
          "type": "string"
        }
      ]
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "esim",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "arg",
                "path": "phoneNumber"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "phoneNumber",
          "type": "string"
        },
        {
          "name": "nullifier",
          "type": "string"
        },
        {
          "name": "active",
          "type": "bool"
        },
        {
          "name": "gender",
          "type": "u8"
        },
        {
          "name": "pincode",
          "type": "u32"
        },
        {
          "name": "state",
          "type": "string"
        }
      ]
    },
    {
      "name": "setStatus",
      "discriminator": [
        181,
        184,
        224,
        203,
        193,
        29,
        177,
        224
      ],
      "accounts": [
        {
          "name": "esim",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "arg",
                "path": "phoneNumber"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "phoneNumber",
          "type": "string"
        },
        {
          "name": "status",
          "type": "bool"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "esim",
      "discriminator": [
        3,
        86,
        114,
        190,
        87,
        161,
        6,
        141
      ]
    }
  ],
  "types": [
    {
      "name": "esim",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "phoneNumber",
            "type": "string"
          },
          {
            "name": "nullifier",
            "type": "string"
          },
          {
            "name": "active",
            "type": "bool"
          },
          {
            "name": "gender",
            "type": "u8"
          },
          {
            "name": "pincode",
            "type": "u32"
          },
          {
            "name": "state",
            "type": "string"
          },
          {
            "name": "updatedAt",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ]
};
