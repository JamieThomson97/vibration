<template>
    
<div class='eventWrapper'>

    <div class="eventInfo">
        Event info
    </div>
    <div class="eventOverlap">
        Event Overlap
    </div>

    <div class="eventStream">
        Stream
    </div>

    <div class="eventArtists">
        artists
    </div>

</div>

</template>

<script>
export default {
    
}
</script>

<style>

    .eventWrapper{
        display: grid;
        grid-template-columns: 2.5fr 3.5fr 3fr;
        grid-template-rows: repeat(12, 1fr);
        grid-gap: 1em;
        height: 100%;
        background-color: #e0a99a
    }

    .eventInfo{

        display: block;
        overflow: auto;
        border: 1px solid;
        grid-column: 1/2;
        grid-row: 1/12;
        background-color: blue;
        color:#e0a99a;
    }

    .eventOverlap{

        display: block;
        overflow: auto;
        border: 1px solid;
        grid-column: 2/3;
        grid-row: 1/6;
        background-color: blue;
        color:#e0a99a;
    }

    .eventArtists{

        display: block;
        overflow: auto;
        border: 1px solid;
        grid-column: 2/3;
        grid-row: 6/12;
        background-color: green;
        color:#e0a99a;
    }

    .eventStream{

        display: block;
        overflow: auto;
        border: 1px solid;
        grid-column: 3/4;
        grid-row: 1/12;
        background-color: black;
        color:#e0a99a;
    }

</style>
