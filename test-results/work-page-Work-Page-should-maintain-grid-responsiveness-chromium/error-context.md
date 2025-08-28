# Page snapshot

```yaml
- generic [ref=e5]:
  - img [ref=e7]
  - heading "Oops! Something went wrong" [level=1] [ref=e9]
  - paragraph [ref=e10]: The application encountered an error. Please refresh the page to continue.
  - group [ref=e11]
  - generic [ref=e13]:
    - button "Refresh Page" [ref=e14]:
      - img [ref=e15]
      - generic [ref=e20]: Refresh Page
    - link "Go Home" [ref=e21] [cursor=pointer]:
      - /url: /
      - img [ref=e22] [cursor=pointer]
      - generic [ref=e25] [cursor=pointer]: Go Home
```