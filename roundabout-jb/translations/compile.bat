@echo off
for %%f in (.\*.json) do (
    echo export default  > ./%%~nf.js
    more %%f >> ./%%~nf.js
)