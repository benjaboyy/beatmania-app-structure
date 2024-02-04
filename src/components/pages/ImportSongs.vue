<template>
  <div class="stats-screen px-2 px-md-5 m-auto">
    <h1 class="text-center my-4">Songs to JSON</h1>
    <div class="card">
      <div class="card-body">
        <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" v-model="excelData"></textarea>
        <button class="btn btn-primary mt-2" @click="convertToJSON">Convert</button>
        <button v-if="convertedJSON" class="btn btn-success mt-2 ms-2" @click="copyToClipboard">Copy JSON to Clipboard</button>
        <div class="bg-light p-3 mt-3">
          <pre v-if="convertedJSON" class="m-0">{{ convertedJSON }}</pre>
          <pre v-else class="m-0">Press convert to make JSON <br>
Format copied from excel:
2	-	-	-	-	-	2 gorgeous 4U	prophet-31
-	-	-	1	-	-	greed eater	The Dust Fathers
4	5	6	4	6	8	NAME	ARTIST</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImportSongs',
  props: {
    msg: String,
  },
  emits: ['select-view'],
  data() {
    return {
      excelData: '',
      convertedJSON: '',
    };
  },
  methods: {
    convertToJSON: function () {
      const rows = this.excelData.split('\n');
      const json = {};

      rows.forEach((row) => {
        const cells = row.split('\t');
        const songname = cells[6];
        const artistname = cells[7];
        const genre = cells[8];
        const id = cells[7].trim().replace(/\s+/g, '').replace(/[^\w\s]/g, '') + Math.floor(Math.random() * 9999);

        const difficulty = {
          difficultyNormal: cells[0] === '' || cells[0] === '-' ? '0' : cells[0].toString(),
          difficultyHard: cells[1] === '' || cells[1] === '-' ? '0' : cells[1].toString(),
          difficultyAnother: cells[2] === '' || cells[2] === '-' ? '0' : cells[2].toString(),
          difficultyDoubleNormal: cells[3] === '' || cells[3] === '-' ? '0' : cells[3].toString(),
          difficultyDoubleHard: cells[4] === '' || cells[4] === '-' ? '0' : cells[4].toString(),
          difficultyDoubleAnother: cells[5] === '' || cells[5] === '-' ? '0' : cells[5].toString(),
        };

        const songData = {
          artist: artistname,
          id: `${id}`,
          name: songname,
          genre: genre,
          ...(Object.values(difficulty).some((value) => value !== undefined) && { ...difficulty }),
        };
        json[`${id}`] = songData;
      });

      this.convertedJSON = JSON.stringify(json, null, 2);
    },

    copyToClipboard() {
      const textarea = document.createElement('textarea');
      textarea.value = this.convertedJSON;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      alert('JSON copied to clipboard!');
    },
  },
};
</script>
