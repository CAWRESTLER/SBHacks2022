{ pkgs ? import <nixpkgs> {} }:
let
    app = pkgs.poetry2nix.mkPoetryApplication {
        projectDir = ./.;
    };
in app.dependencyEnv
