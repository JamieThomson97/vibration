<template>
    
    <div class="userWrapper">
        <div class="image">
        <div>
            <div>Image</div>
            
        </div>
        </div>
        <div class="mixes">
            <div>Mixes</div>
        </div>
        <div class="currentInfo">
            <div>Information</div>
        </div>
        <div class="follow">Follow/Unfollow btn + no. of followers etc...</div>
        <div class="userPlayer">User Player</div>
    </div>
        
   
</template>

<script>
export default {
    
}
</script>

<style>

    .userWrapper{
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: repeat(4,1fr);
        grid-gap: 1em;
        height: 100%
    }

    .image{
        border: solid 1px;
        grid-column: 1/2;
        grid-row: 1/4
    }

    .mixes{
        border: solid 1px;
        grid-column: 2/5;
        grid-row: 1/2;
    }

    .follow{
        border: solid 1px;
        grid-column: 2/5;
        grid-row: 2/3;
    }

    .currentInfo{
        border: solid 1px;
        grid-column: 2/5;
        grid-row: 3/4;
    }

    .userPlayer{
        border: solid 1px;
        grid-row: 4/5;
        grid-column: 1/-1;        
    }

</style>


