# LaTeX Explanation Template

Use the following structure for `.tex` files in `public/explanations/`.

## Structure

```latex
\section*{[Project Title]}

\subsection*{Safety Warning}
\begin{center}
\textbf{\color{red}WARNING: [Critical safety instructions].}
\end{center}

\subsection*{Scientific Principle: [Name of Principle]}
[Brief explanation of the science, laws of physics, or chemistry involved.]

\subsection*{Installation Diagram}
\includegraphics[[Alt Text]]{data:image/svg+xml;base64,[SINGLE_LINE_BASE64_STRING]}

\subsection*{Materials Needed}
\begin{itemize}
    \item [Material 1]
    \item [Material 2]
\end{itemize}

\subsection*{Build Steps}
\begin{enumerate}
    \item \textbf{[Step 1 Title]}: [Description].
    \item \textbf{[Step 2 Title]}: [Description].
\end{enumerate}
```

## Diagram Encoding Guidelines
- SVG must be compact and valid.
- Convert SVG to Base64 using a single line (no newlines/spaces).
- Example generator: `Buffer.from(svg).toString('base64')`.
