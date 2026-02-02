# Phase Review Template

Template for `.planning/phases/XX-name/{phase}-REVIEW.md`.

---

## File Template

```markdown
# Phase Review

Phase: {phase}
Name: {phase_name}
Mode: {standard | gap_closure}
Updated: {YYYY-MM-DD}

## Decisions & Tradeoffs
- [Decision] (proposed default: ...)
  - Options considered:
  - Pros:
  - Cons:
  - Open question:

## Assumptions
- ...

## Questions for Review
- ...

## Reviewer Notes (User)
- ...

## Parallelization Safety Review
- [ ] `files_modified` allowlist looks complete for each plan
- [ ] `locks` declared for shared resources (deps/tests-harness/ci-config/app-config/planning-docs)
- [ ] `may_touch_globs` covers likely shared files (e.g., tests/**/conftest.*)

## Approval
Status: Pending | Approved
Approved by: [name or handle]
Date: [YYYY-MM-DD]
```
