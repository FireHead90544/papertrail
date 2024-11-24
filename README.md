# papertrail

Publications Summary Generator for Faculty  Members' Profile Building (PS SIH1614). Team That1Bit's submission for the Smart India Hackathon (SIH) 2024.

## Update

This project has been archived since I had been the sole programmer of the team. The current state is just a minimal prototype of the UI, everything else needs to be continued. I won't be pushing any updates in the near future since SIH is already over, the high-level architectural details can be infered from the diagram below, so if you want to contribute to it, fork, edit and generate a pr.

You can use `example.bib` as an example to test out the [live demo](https://papertrailbythat1bit.vercel.app/). This example contains the handpicked tex records of Prof. Sebastian Raschka (@rasbt), so props to him. The webapp might contain hard-coded outputs since it's just a prototype, that's not a mistake but was intentional. The build checks are also disabled in the current state.

# Architecture

![image](https://github.com/user-attachments/assets/5db17b7f-12a0-416f-8ce6-28b9c1e94560)


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
