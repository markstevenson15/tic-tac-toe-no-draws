#!/usr/bin/env python3
"""
Transcript Export Tool for Antigravity IDE

Locates the active machine-generated JSONL transcript from the IDE's brain directory,
updates the repository's transcript files, and generates a formatted Markdown export.
"""

import os
import json
import shutil
from datetime import datetime

CONVERSATION_ID = "c811d9fe-ab1c-4316-96e0-4960828be7a2"
BRAIN_LOGS_DIR = f"/Users/markstevenson/.gemini/antigravity-ide/brain/{CONVERSATION_ID}/.system_generated/logs"
SOURCE_FULL_JSONL = os.path.join(BRAIN_LOGS_DIR, "transcript_full.jsonl")

REPO_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TRANSCRIPT_DIR = os.path.join(REPO_DIR, "transcript")
SESSIONS_DIR = os.path.join(TRANSCRIPT_DIR, "sessions")
SNAPSHOTS_DIR = os.path.join(TRANSCRIPT_DIR, "snapshots")

DEST_SESSION_FILE = os.path.join(SESSIONS_DIR, f"{CONVERSATION_ID}.jsonl")
DEST_LATEST_FILE = os.path.join(TRANSCRIPT_DIR, "transcript_latest.jsonl")
DEST_MD_FILE = os.path.join(TRANSCRIPT_DIR, "TRANSCRIPT_READABLE.md")

def export_transcript():
    if not os.path.exists(SOURCE_FULL_JSONL):
        print(f"Error: Source transcript not found at: {SOURCE_FULL_JSONL}")
        return

    os.makedirs(SESSIONS_DIR, exist_ok=True)
    os.makedirs(SNAPSHOTS_DIR, exist_ok=True)

    # 1. Copy raw JSONL files
    shutil.copy2(SOURCE_FULL_JSONL, DEST_SESSION_FILE)
    shutil.copy2(SOURCE_FULL_JSONL, DEST_LATEST_FILE)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    snapshot_path = os.path.join(SNAPSHOTS_DIR, f"transcript_{timestamp}.jsonl")
    shutil.copy2(SOURCE_FULL_JSONL, snapshot_path)

    print(f"✔ Copied raw JSONL to: {DEST_SESSION_FILE}")
    print(f"✔ Created snapshot at: {snapshot_path}")

    # 2. Generate clean human-readable Markdown format
    with open(SOURCE_FULL_JSONL, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    md_lines = [
        "# Complete AI Development Conversation Transcript\n",
        f"**Conversation ID:** `{CONVERSATION_ID}`  \n",
        f"**Exported At:** `{datetime.now().isoformat()}`  \n",
        f"**Total Trajectory Steps:** `{len(lines)}`  \n\n",
        "---\n\n"
    ]

    for line in lines:
        try:
            entry = json.loads(line)
        except Exception:
            continue

        step_idx = entry.get('step_index', '')
        source = entry.get('source', '')
        step_type = entry.get('type', '')
        created_at = entry.get('created_at', '')
        content = entry.get('content', '')
        tool_calls = entry.get('tool_calls', [])

        if step_type == 'USER_INPUT':
            md_lines.append(f"## 👤 User Prompt (Step {step_idx}) — `{created_at}`\n\n")
            md_lines.append(f"{content}\n\n---\n\n")
        elif step_type == 'PLANNER_RESPONSE':
            md_lines.append(f"## 🤖 Assistant Response (Step {step_idx}) — `{created_at}`\n\n")
            if content:
                md_lines.append(f"{content}\n\n")
            if tool_calls:
                md_lines.append("### Tool Calls Made:\n")
                for tc in tool_calls:
                    name = tc.get('name', '')
                    args = tc.get('args', {})
                    summary = args.get('toolSummary', '')
                    action = args.get('toolAction', '')
                    md_lines.append(f"- **`{name}`**: {action} ({summary})\n")
                md_lines.append("\n")
            md_lines.append("---\n\n")

    with open(DEST_MD_FILE, 'w', encoding='utf-8') as f:
        f.writelines(md_lines)

    print(f"✔ Generated human-readable Markdown transcript at: {DEST_MD_FILE}")

if __name__ == '__main__':
    export_transcript()
