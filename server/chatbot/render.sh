#!/bin/bash
# This script will be used by Render to start the application
export GUNICORN_CMD_ARGS="--bind=0.0.0.0:$PORT --workers=1"
exec gunicorn run:app
